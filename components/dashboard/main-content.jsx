"use client"

import { useState, useEffect } from "react"
import { MetricCard } from "./metric-card"
import { VisitorsChart } from "./visitors-chart"
import { SalesChart } from "./sales-chart"
import { BookingsTable } from "./bookings-table"
import { ConversionOverview } from "./conversion-overview"
import { PythonPlot } from "./python-plot"

export function MainContent({ activeFilter, setActiveFilter }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [metrics, setMetrics] = useState(null) // <-- metrics state

  const filterTabs = ["ALL", "REVENUE", "OCCUPANCY"]

  const handleBookingCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const shouldShowRevenue = activeFilter === "ALL" || activeFilter === "REVENUE"
  const shouldShowOccupancy = activeFilter === "ALL" || activeFilter === "OCCUPANCY"

  // Fetch metrics from API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("https://dormie-acuc.onrender.com/metrics") // <-- Flask endpoint
        const data = await res.json()
        setMetrics(data)
      } catch (err) {
        console.error("Failed to fetch metrics:", err)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000) // refresh every 60s
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-6 max-w-full h-full">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's your analytics overview.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeFilter === tab
                  ? "text-foreground border-b-primary"
                  : "text-muted-foreground border-b-transparent hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
          {/* Show metrics only if loaded */}
          {metrics ? (
            <>
              {(activeFilter === "ALL" || shouldShowRevenue) && (
                <MetricCard
                  title="Transaction Count"
                  value={metrics["Transaction Count"].value}
                  change={metrics["Transaction Count"].change}
                  timeframe={metrics["Transaction Count"].timeframe}
                />
              )}
              {shouldShowRevenue && (
                <MetricCard
                  title="Total Revenue"
                  value={metrics["Total Revenue"].value}
                  change={metrics["Total Revenue"].change}
                  timeframe={metrics["Total Revenue"].timeframe}
                />
              )}
              {shouldShowOccupancy && (
                <MetricCard
                  title="Occupancy Rate"
                  value={metrics["Occupancy Rate"].value}
                  change={metrics["Occupancy Rate"].change}
                  timeframe={metrics["Occupancy Rate"].timeframe}
                />
              )}
              {shouldShowRevenue && (
                <MetricCard
                  title="Average Daily Revenue"
                  value={metrics["Average Daily Revenue"].value}
                  change={metrics["Average Daily Revenue"].change}
                  timeframe={metrics["Average Daily Revenue"].timeframe}
                />
              )}
            </>
          ) : (
            <p>Loading metrics...</p>
          )}
        </div>

        {/* Charts */}
        {(activeFilter === "ALL" || shouldShowOccupancy) && <VisitorsChart />}
        {shouldShowOccupancy && <ConversionOverview />}
        {shouldShowRevenue && <PythonPlot />}
        {shouldShowRevenue && <SalesChart />}

        {/* Bookings Table */}
        {activeFilter === "ALL" && <BookingsTable key={refreshKey} />}
        {activeFilter === "REVENUE" && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Transactions</h3>
            <BookingsTable key={refreshKey} />
          </div>
        )}
        {activeFilter === "OCCUPANCY" && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Room Occupancy</h3>
            <BookingsTable key={refreshKey} />
          </div>
        )}
      </div>
    </main>
  )
}
