"use client"

import { MetricCard } from "./metric-card"
import { VisitorsChart } from "./visitors-chart"
import { SalesChart } from "./sales-chart"
import { BookingsTable } from "./bookings-table"
import { ConversionOverview } from "./conversion-overview"
import { useState } from "react"
import { PythonPlot } from "./python-plot"

export function MainContent({ activeFilter, setActiveFilter }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const filterTabs = ["ALL", "REVENUE", "OCCUPANCY"]

  const handleBookingCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's your analytics overview.</p>
        </div>

        <div className="flex gap-4 mb-8 border-b border-border">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Transaction Count" value="1,247" change={12.5} timeframe="This week" />
          <MetricCard title="Total Revenue" value="₱45,231" change={8.2} timeframe="This month" />
          <MetricCard title="Occupancy Rate" value="68.5%" change={-2.1} timeframe="This month" />
          <MetricCard title="Average Daily Revenue" value="₱6,461" change={5.8} timeframe="This week" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <VisitorsChart />
          </div>
          <ConversionOverview />
        </div>

        <div className="mb-8">
          <PythonPlot />
        </div>

        {/* Sales Chart */}
        <div className="mb-8">
          <SalesChart />
        </div>

        <BookingsTable key={refreshKey} />
      </div>
    </main>
  )
}
