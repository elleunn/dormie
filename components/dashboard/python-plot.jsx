"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

const endpoints = [
  { id: "cluster_customers", label: "Customer Clusters" },
  { id: "forecast_linear", label: "Forecast Linear" },
  { id: "forecast_sarima", label: "Forecast SARIMA" },
  { id: "forecast_arima", label: "Forecast ARIMA" },
  ,
]

export function PythonPlot() {
  const [plotData, setPlotData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0].id)

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        setLoading(true)
        setError(null)
        setPlotData(null)

        const response = await fetch(`https://dormie-acuc.onrender.com/${selectedEndpoint}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch plot: ${response.status}`)
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPlotData(url)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching plot:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlot()
  }, [selectedEndpoint])

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Analytics Plot</h3>

      <div className="mb-4 flex gap-4">
        {endpoints.map((ep) => (
          <button
            key={ep.id}
            onClick={() => setSelectedEndpoint(ep.id)}
            className={`px-3 py-1 rounded ${
              ep.id === selectedEndpoint
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {ep.label}
          </button>
        ))}
      </div>

      <div className="w-full overflow-hidden" style={{ height: "500px" }}>
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading plot...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        {plotData && !loading && (
          <img
            src={plotData}
            alt="Python Plot"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </div>
    </Card>
  )
}
