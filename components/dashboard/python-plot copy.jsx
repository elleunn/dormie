"use client"

import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

export function PythonPlot() {
  const [plotData, setPlotData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://127.0.0.1:5000/get_plot")
        if (!response.ok) {
          throw new Error(`Failed to fetch plot: ${response.status}`)
        }
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPlotData(url)
      } catch (err) {
        setError(err.message)
        console.log("[v0] Error fetching plot:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlot()
  }, [])

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Analytics Plot</h3>
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
            src={plotData || "/placeholder.svg"}
            alt="Python Plot"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </div>
    </Card>
  )
}
