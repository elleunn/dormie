"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

export function BookingsTable() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch("https://dormie-backend.onrender.com/api/bookings")
      if (!res.ok) throw new Error("Failed to fetch bookings")
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="text-chart-1 text-sm font-medium hover:underline disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4 inline mr-1" />
          Refresh
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded">Error: {error}</div>}

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No bookings found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Room</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Arrival</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Departure</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Floor</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4 text-foreground font-medium">{booking.rooms_name || "N/A"}</td>
                  <td className="py-4 px-4 text-foreground">{formatDate(booking.arrived_date)}</td>
                  <td className="py-4 px-4 text-foreground">{formatDate(booking.departure_date)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        booking.status === "confirmed" ? "bg-chart-1/20 text-chart-1" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {booking.status || "pending"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-foreground">{booking.floor_no || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
