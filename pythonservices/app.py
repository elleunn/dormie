from flask import Flask, Response, jsonify  # <-- add jsonify for the new API
from flask_cors import CORS
import threading
import time
import io
import pandas as pd
from sqlalchemy import create_engine
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
import numpy as np
from datetime import timedelta  # <-- for metrics calculations
import math

# ML imports
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.preprocessing import LabelEncoder
from sklearn.cluster import KMeans
import seaborn as sns
import pmdarima as pm
from statsmodels.tsa.arima.model import ARIMA

app = Flask(__name__)
CORS(app)  # allow all origins (useful for dev)

# ------------------- Database Connection -------------------
engine = create_engine(
    "postgresql+psycopg2://neondb_owner:npg_8s7xJrZaQPXE@ep-billowing-art-a1fsspe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
)

# ------------------- GLOBAL PLOT BUFFERS -------------------
latest_linear_plot = None
latest_sarima_plot = None
latest_arima_plot = None
latest_cluster_plot = None

# ------------------- DATA LOAD UTILITY -------------------
def load_transactions():
    df = pd.read_sql("SELECT * FROM transactions", engine)
    df['date_accept'] = pd.to_datetime(df['date_accept'], errors='coerce')
    df = df[df['date_accept'].dt.year.between(2020, 2025)]
    df['year'] = df['date_accept'].dt.year
    df['quarter_num'] = df['date_accept'].dt.quarter
    df['quarter_label'] = df.apply(lambda x: f"Q{x.quarter_num}-{str(x.year)[-2:]}", axis=1)
    df = df[~((df['year'] == 2025) & (df['quarter_num'] > 1))]
    return df

# ------------------- LINEAR REGRESSION FORECAST -------------------
def generate_linear_forecast():
    global latest_linear_plot
    df = load_transactions()
    quarterly = df.groupby(['year','quarter_label'])['gross_amount'].sum().reset_index().sort_values('year')
    quarterly['time_index'] = range(len(quarterly))
    quarterly['smoothed'] = quarterly['gross_amount'].rolling(window=2, center=True).mean()
    
    train_df = quarterly.dropna(subset=['smoothed'])
    X = train_df[['time_index']]
    y = train_df['smoothed']
    model = LinearRegression().fit(X, y)
    
    # Forecast next 3 quarters
    future_indices = list(range(len(quarterly), len(quarterly)+3))
    future_df = pd.DataFrame({'time_index': future_indices})
    future_forecasts = model.predict(future_df)
    
    # Generate labels
    cur_year = quarterly['year'].iloc[-1]
    cur_q = int(quarterly['quarter_label'].iloc[-1][1])
    future_labels = []
    for _ in range(3):
        cur_q += 1
        if cur_q > 4:
            cur_q = 1
            cur_year += 1
        future_labels.append(f"Q{cur_q}-{str(cur_year)[-2:]}")
    
    # Metrics
    y_pred = model.predict(X)
    mse = mean_squared_error(y, y_pred)
    mae = mean_absolute_error(y, y_pred)
    r2 = r2_score(y, y_pred)
    
    # Plot
    plt.figure(figsize=(12,6))
    plt.plot(quarterly['quarter_label'], quarterly['gross_amount']/1e6, color='gray', alpha=0.5, label='Raw Quarterly Revenue')
    plt.plot(quarterly['quarter_label'], quarterly['smoothed']/1e6, marker='o', color='blue', label='Smoothed (Rolling Avg)')
    for label, pred in zip(future_labels, future_forecasts):
        plt.plot(label, pred/1e6, marker='o', linestyle='--', color='orange')
        plt.text(label, pred/1e6, f"{pred/1e6:.2f}M")
    plt.plot([quarterly['quarter_label'].iloc[-1], future_labels[0]], [quarterly['smoothed'].iloc[-1]/1e6, future_forecasts[0]/1e6], linestyle='--', color='orange', alpha=0.8)
    plt.title(f"Linear Regression Forecast (2020–Q4 2025)\nMSE={mse:.2f} | MAE={mae:.2f} | R²={r2:.2f}")
    plt.xlabel("Quarter")
    plt.ylabel("Gross Revenue (₱ millions)")
    plt.xticks(rotation=45)
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    latest_linear_plot = buf
    plt.close()

# ------------------- SARIMA FORECAST -------------------
def generate_sarima_forecast():
    global latest_sarima_plot
    df = load_transactions()
    quarterly = df.groupby(['year','quarter_label'])['gross_amount'].sum().reset_index().sort_values('year')
    
    # Correct quarter_start
    quarterly['quarter_start'] = pd.to_datetime(
        quarterly['quarter_label'].apply(
            lambda q: pd.Timestamp(year=2000+int(q[-2:]), month=(int(q[1])-1)*3+1, day=1)
        )
    )
    
    ts = quarterly.set_index('quarter_start')['gross_amount']
    
    sarima_model = pm.auto_arima(
        ts,
        start_p=0, start_q=0, max_p=3, max_q=3, d=None,
        seasonal=True, start_P=0, start_Q=0, max_P=2, max_Q=2, D=None, m=4,
        trace=False, error_action='ignore', suppress_warnings=True, stepwise=True
    )
    
    forecast, conf_int = sarima_model.predict(n_periods=3, return_conf_int=True)
    
    # Generate labels
    last_quarter = quarterly['quarter_label'].iloc[-1]
    last_q_num = int(last_quarter[1])
    last_year = quarterly['year'].iloc[-1]
    future_labels = []
    q_num = last_q_num
    year = last_year
    for _ in range(3):
        q_num += 1
        if q_num > 4:
            q_num = 1
            year += 1
        future_labels.append(f"Q{q_num}-{str(year)[-2:]}")
    
    y_pred = pd.Series(sarima_model.predict_in_sample(), index=ts.index)
    y_true = ts
    mse = mean_squared_error(y_true, y_pred)
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    
    plt.figure(figsize=(12,6))
    plt.plot(quarterly['quarter_label'], quarterly['gross_amount']/1e6, color='gray', alpha=0.5, label='Raw Revenue')
    plt.plot(quarterly['quarter_label'], y_pred/1e6, marker='o', color='blue', label='SARIMA Fit')
    
    # ✅ Corrected forecast plotting
    plt.plot(future_labels, forecast/1e6, marker='o', linestyle='--', color='orange', label='Forecast')
    for x, y in zip(future_labels, forecast/1e6):
        plt.text(x, y, f"{y:.2f}M", ha='center', va='bottom')
    
    # Connect last fitted → first forecast
    plt.plot(
        [quarterly['quarter_label'].iloc[-1], future_labels[0]],
        [y_pred.iloc[-1]/1e6, forecast[0]/1e6],
        linestyle='--', color='orange', alpha=0.8
    )
    
    plt.title(f"SARIMA Forecast (2020–Q4 2025)\nMSE={mse:.2f} | MAE={mae:.2f} | R²={r2:.2f}")
    plt.xlabel("Quarter")
    plt.ylabel("Gross Revenue (₱ millions)")
    plt.xticks(rotation=45)
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    latest_sarima_plot = buf
    plt.close()

# ------------------- ARIMA FORECAST -------------------
def generate_arima_forecast():
    global latest_arima_plot
    df = load_transactions()
    quarterly = df.groupby(['year','quarter_label'])['gross_amount'].sum().reset_index().sort_values('year')
    
    def quarter_start_date(q_label):
        q_num = int(q_label[1])
        year = 2000 + int(q_label[-2:])
        month = (q_num-1)*3+1
        return pd.Timestamp(year=year, month=month, day=1)
    
    quarterly['quarter_start'] = quarterly['quarter_label'].apply(quarter_start_date)
    ts = quarterly.set_index('quarter_start')['gross_amount']
    
    model = ARIMA(ts, order=(2,1,2))
    results = model.fit()
    
    steps_ahead = 3
    forecast = results.forecast(steps=steps_ahead)
    
    y_pred = results.fittedvalues
    y_true = ts
    mse = mean_squared_error(y_true[1:], y_pred[1:])
    mae = mean_absolute_error(y_true[1:], y_pred[1:])
    rmse = np.sqrt(mse)
    mape = (abs((y_true[1:] - y_pred[1:]) / y_true[1:]).mean())*100
    r2 = r2_score(y_true[1:], y_pred[1:])
    
    last_quarter = quarterly['quarter_label'].iloc[-1]
    last_q_num = int(last_quarter[1])
    year = quarterly['year'].iloc[-1]
    q_num = last_q_num
    future_labels = []
    for _ in range(steps_ahead):
        q_num +=1
        if q_num>4:
            q_num=1
            year+=1
        future_labels.append(f"Q{q_num}-{str(year)[-2:]}")
    
    plt.figure(figsize=(12,6))
    plt.plot(quarterly['quarter_label'], quarterly['gross_amount']/1e6, color='gray', alpha=0.5, label='Raw Revenue')
    plt.plot(quarterly['quarter_label'], y_pred/1e6, marker='o', color='blue', label='ARIMA Fit')
    for i in range(steps_ahead):
        plt.plot(future_labels[i], forecast[i]/1e6, marker='o', linestyle='--', color='orange')
        plt.text(future_labels[i], forecast[i]/1e6, f"{forecast[i]/1e6:.2f}M")
    plt.plot([quarterly['quarter_label'].iloc[-1], future_labels[0]], [y_pred.iloc[-1]/1e6, forecast[0]/1e6], linestyle='--', color='orange', alpha=0.8)
    plt.title(f"ARIMA Forecast (2020–Q4 2025)\nMSE={mse:.2f} | MAE={mae:.2f} | RMSE={rmse:.2f} | MAPE={mape:.2f}% | R²={r2:.2f}")
    plt.xlabel("Quarter")
    plt.ylabel("Gross Revenue (₱ millions)")
    plt.xticks(rotation=45)
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    latest_arima_plot = buf
    plt.close()

# ------------------- K-MEANS CLUSTERING -------------------
def generate_cluster_plot():
    global latest_cluster_plot
    query = """
    SELECT t.transaction_id, t.day_of_stay, t.gross_amount, b.type AS room_type
    FROM transactions t
    JOIN bookings b ON t.transaction_id = b.transaction_id
    WHERE t.gross_amount IS NOT NULL AND t.day_of_stay IS NOT NULL
    """
    df = pd.read_sql(query, engine)
    le = LabelEncoder()
    df['room_type_encoded'] = le.fit_transform(df['room_type'])
    features = df[['day_of_stay','gross_amount','room_type_encoded']]
    
    kmeans = KMeans(n_clusters=3, random_state=42)
    df['cluster'] = kmeans.fit_predict(features)
    
    plt.figure(figsize=(8,6))
    sns.scatterplot(data=df, x='day_of_stay', y='gross_amount', hue='cluster', palette='Set2', s=80)
    plt.title("Customer Segmentation: Stay Length vs Revenue")
    plt.xlabel("Day of Stay")
    plt.ylabel("Gross Amount (Revenue)")
    plt.legend(title='Cluster')
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    latest_cluster_plot = buf
    plt.close()

# ------------------- NEW METRICS API -------------------
# ------------------- NEW METRICS API (ROLLING DAYS) -------------------
@app.route('/metrics')
def get_metrics():
    df = pd.read_sql("SELECT * FROM transactions", engine)
    df['date_accept'] = pd.to_datetime(df['date_accept'], errors='coerce')
    
    # Ensure unit-nights column exists
    if 'day_of_stay' not in df.columns:
        df['day_of_stay'] = 1  # fallback if missing

    latest_date = df['date_accept'].max()
    
    # ---------------- Transaction Count (last 7 days) ----------------
    current_week_start = latest_date - pd.Timedelta(days=6)
    prev_week_start = current_week_start - pd.Timedelta(days=7)
    prev_week_end = current_week_start - pd.Timedelta(days=1)
    
    tx_count_week = df[df['date_accept'] >= current_week_start].shape[0]
    tx_count_prev = df[(df['date_accept'] >= prev_week_start) & (df['date_accept'] <= prev_week_end)].shape[0]
    tx_change = ((tx_count_week - tx_count_prev) / tx_count_prev * 100) if tx_count_prev else 0

    # ---------------- Total Revenue (last 30 days) ----------------
    current_month_start = latest_date - pd.Timedelta(days=29)
    prev_month_start = current_month_start - pd.Timedelta(days=30)
    prev_month_end = current_month_start - pd.Timedelta(days=1)

    rev_month = df[df['date_accept'] >= current_month_start]['gross_amount'].sum()
    rev_prev = df[(df['date_accept'] >= prev_month_start) & (df['date_accept'] <= prev_month_end)]['gross_amount'].sum()
    rev_change = ((rev_month - rev_prev)/rev_prev*100) if rev_prev else 0

    # ---------------- Occupancy Rate (last 30 days, using unit-nights) ----------------
    # Total sellable units
    df_rooms = pd.read_sql("SELECT * FROM rooms", engine)
    df_rooms['sellable_units'] = df_rooms['room_capacity'].apply(lambda x: 1 if x == 2 else x)
    total_sellable_units = df_rooms['sellable_units'].sum()
    
    # Available unit-nights = total sellable units * number of days
    days_current = (latest_date - current_month_start).days + 1
    days_prev = (current_month_start - prev_month_start).days
    available_unit_nights_current = total_sellable_units * days_current
    available_unit_nights_prev = total_sellable_units * days_prev

    # Sold unit-nights = sum of day_of_stay for bookings in period
    sold_unit_nights_current = df[df['date_accept'] >= current_month_start]['day_of_stay'].sum()
    sold_unit_nights_prev = df[(df['date_accept'] >= prev_month_start) & (df['date_accept'] <= prev_month_end)]['day_of_stay'].sum()

    occupancy = (sold_unit_nights_current / available_unit_nights_current * 100) if available_unit_nights_current else 0
    occupancy_prev = (sold_unit_nights_prev / available_unit_nights_prev * 100) if available_unit_nights_prev else 0
    occupancy_change = occupancy - occupancy_prev

    # ---------------- Average Daily Revenue (last 7 days) ----------------
    daily_rev_current = df[df['date_accept'] >= current_week_start].groupby(df['date_accept'].dt.date)['gross_amount'].sum()
    daily_rev_prev = df[(df['date_accept'] >= prev_week_start) & (df['date_accept'] <= prev_week_end)].groupby(df['date_accept'].dt.date)['gross_amount'].sum()
    
    avg_daily_rev = daily_rev_current.mean() if not daily_rev_current.empty else 0
    avg_daily_rev_prev = daily_rev_prev.mean() if not daily_rev_prev.empty else 0
    avg_daily_change = ((avg_daily_rev - avg_daily_rev_prev)/avg_daily_rev_prev*100) if avg_daily_rev_prev else 0

    return jsonify({
        "Transaction Count": {
            "value": tx_count_week,
            "timeframe": "Last 7 days",
            "change": round(tx_change,1)
        },
        "Total Revenue": {
            "value": f"₱{round(rev_month,0):,.0f}",
            "timeframe": "Last 30 days",
            "change": round(rev_change,1)
        },
        "Occupancy Rate": {
            "value": f"{round(occupancy,1)}%",
            "timeframe": "Last 30 days",
            "change": round(occupancy_change,1)
        },
        "Average Daily Revenue": {
            "value": f"₱{round(avg_daily_rev,0):,.0f}",
            "timeframe": "Last 7 days",
            "change": round(avg_daily_change,1)
        }
    })
    
# ------------------- API ROUTES -------------------
@app.route('/forecast_linear')
def forecast_linear():
    generate_linear_forecast()
    return Response(latest_linear_plot.getvalue(), mimetype='image/png')

@app.route('/forecast_sarima')
def forecast_sarima():
    generate_sarima_forecast()
    return Response(latest_sarima_plot.getvalue(), mimetype='image/png')

@app.route('/forecast_arima')
def forecast_arima():
    generate_arima_forecast()
    return Response(latest_arima_plot.getvalue(), mimetype='image/png')

@app.route('/cluster_customers')
def cluster_customers():
    generate_cluster_plot()
    return Response(latest_cluster_plot.getvalue(), mimetype='image/png')

# ------------------- BACKGROUND TASK (OPTIONAL) -------------------
def background_task():
    while True:
        generate_linear_forecast()
        generate_sarima_forecast()
        generate_arima_forecast()
        generate_cluster_plot()
        time.sleep(3600)  # refresh hourly

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Flask predictive service running on 0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port)
