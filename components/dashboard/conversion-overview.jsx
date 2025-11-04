"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function ConversionOverview() {
  return (
    <Card className="bg-card border-border p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-6">Occupancy Overview</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-chart-1" />
              <span className="text-sm font-medium text-foreground">Occupancy Rate</span>
            </div>
            <p className="text-2xl font-bold text-chart-1">68.5%</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-chart-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l0.02-.12 0.9-1.63h7.45c0.75 0 1.41-.41 1.75-1.03l3.58-6.49c0.08-.14.12-.31.12-.48 0-0.55-0.45-1-1-1H5.21l-0.94-2H1zm16 16c-1.1 0-1.99 0.9-1.99 2s0.89 2 1.99 2 2-0.9 2-2-0.9-2-2-2z" />
              </svg>
              <span className="text-sm font-medium text-foreground">Average Revenue</span>
            </div>
            <p className="text-2xl font-bold text-chart-2">₱6,461</p>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border">
        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
          View Details
        </button>
      </div>
    </Card>
  )
}
