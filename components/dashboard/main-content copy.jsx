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

  const shouldShowRevenue = activeFilter === "ALL" || activeFilter === "REVENUE"
  const shouldShowOccupancy = activeFilter === "ALL" || activeFilter === "OCCUPANCY"

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
          {(activeFilter === "ALL" || activeFilter === "REVENUE") && (
            <MetricCard title="Transaction Count" value="1,247" change={12.5} timeframe="This week" />
          )}
          {shouldShowRevenue && (
            <MetricCard title="Total Revenue" value="₱45,231" change={8.2} timeframe="This month" />
          )}
          {shouldShowOccupancy && (
            <MetricCard title="Occupancy Rate" value="68.5%" change={-2.1} timeframe="This month" />
          )}
          {shouldShowRevenue && (
            <MetricCard title="Average Daily Revenue" value="₱6,461" change={5.8} timeframe="This week" />
          )}
        </div>

        {/* Charts */}
        {/* VisitorsChart for ALL and OCCUPANCY */}
        {(activeFilter === "ALL" || activeFilter === "OCCUPANCY") && (
          <div className="mb-6">
            <VisitorsChart />
          </div>
        )}

        {/* ConversionOverview only in OCCUPANCY */}
        {activeFilter === "OCCUPANCY" && (
          <div className="mb-6">
            <ConversionOverview />
          </div>
        )}

        {/* PythonPlot and SalesChart only for REVENUE */}
        {shouldShowRevenue && (
          <div className="mb-6">
            <PythonPlot />
          </div>
        )}

        {shouldShowRevenue && (
          <div className="mb-6">
            <SalesChart />
          </div>
        )}

        {/* BookingsTable per filter */}
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
