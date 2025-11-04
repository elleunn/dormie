import { TrendingUp, TrendingDown } from "lucide-react"

export function MetricCard({ title, value, change, timeframe }) {
  const isPositive = change >= 0

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <div className="mb-4">
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{timeframe}</span>
        <div className={`flex items-center gap-1 ${isPositive ? "text-chart-1" : "text-destructive"}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-semibold">{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  )
}
