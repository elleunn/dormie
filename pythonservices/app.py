from flask import Flask, Response
import io
import pandas as pd
from sqlalchemy import create_engine
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import matplotlib.pyplot as plt
import threading
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow all origins (for dev)

# Connect to NeonDB
engine = create_engine(
    "postgresql+psycopg2://neondb_owner:npg_8s7xJrZaQPXE@ep-billowing-art-a1fsspe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
)

latest_plot = None

def run_forecast():
    global latest_plot
    print("Running background predictive forecast...")

    df = pd.read_sql("SELECT * FROM transactions", engine)
    df['date_accept'] = pd.to_datetime(df['date_accept'])
    df['month'] = df['date_accept'].dt.month
    df['year'] = df['date_accept'].dt.year

    monthly = df.groupby(['year', 'month'])['gross_amount'].sum().reset_index()
    monthly['time_index'] = range(len(monthly))
    monthly['smoothed'] = monthly['gross_amount'].rolling(window=3, center=True).mean()

    train_df = monthly.dropna(subset=['smoothed'])
    X = train_df[['time_index']]
    y = train_df['smoothed']
    model = LinearRegression().fit(X, y)

    future = pd.DataFrame({'time_index': range(len(monthly), len(monthly) + 3)})
    pred = model.predict(future)

    y_pred = model.predict(X)
    mse = mean_squared_error(y, y_pred)
    mae = mean_absolute_error(y, y_pred)
    r2 = r2_score(y, y_pred)

    plt.figure(figsize=(10, 6))
    plt.plot(monthly['time_index'], monthly['gross_amount'], color='gray', alpha=0.5, label='Raw Revenue')
    plt.plot(monthly['time_index'], monthly['smoothed'], marker='o', label='Smoothed (Rolling Avg)', color='blue')
    plt.plot(future['time_index'], pred, marker='o', linestyle='--', color='orange', label='Forecast')

    plt.title(f"Smoothed Revenue Forecast\nMSE={mse:.2f} | MAE={mae:.2f} | R²={r2:.2f}")
    plt.xlabel("Time (months)")
    plt.ylabel("Gross Revenue")
    plt.legend()
    plt.grid(True, linestyle="--", alpha=0.7)
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    latest_plot = buf
    plt.close()
    print("✅ Forecast plot updated.")

@app.route('/get_plot')
def get_plot():
    if latest_plot:
        return Response(latest_plot.getvalue(), mimetype='image/png')
    else:
        return "Plot not ready yet, please refresh in a few seconds.", 503

def background_task():
    while True:
        run_forecast()
        time.sleep(3600)  # rerun every hour

if __name__ == '__main__':
    threading.Thread(target=background_task, daemon=True).start()
    print("🚀 Flask predictive service running at http://localhost:5000")
    app.run(debug=True)
