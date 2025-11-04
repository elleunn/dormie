"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

const data = [
  { month: "JUN", thisYear: 2000, lastYear: 1800 },
  { month: "JUL", thisYear: 3200, lastYear: 2400 },
  { month: "AUG", thisYear: 2800, lastYear: 2200 },
  { month: "SEP", thisYear: 3100, lastYear: 2600 },
  { month: "OCT", thisYear: 3500, lastYear: 2800 },
  { month: "NOV", thisYear: 3000, lastYear: 2400 },
  { month: "DEC", thisYear: 3800, lastYear: 3000 },
]

export function SalesChart() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Sales Over Time</h3>
        <a href="#" className="text-chart-1 text-sm font-medium hover:underline">
          View Report
        </a>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
          <XAxis dataKey="month" stroke="hsl(var(--color-muted-foreground))" />
          <YAxis stroke="hsl(var(--color-muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--color-card))",
              border: "1px solid hsl(var(--color-border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--color-foreground))" }}
          />
          <Legend />
          <Bar dataKey="thisYear" fill="hsl(var(--color-chart-1))" radius={[8, 8, 0, 0]} />
          <Bar dataKey="lastYear" fill="hsl(var(--color-chart-2))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
