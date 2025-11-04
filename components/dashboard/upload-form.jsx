"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function UploadForm({ onBookingCreated }) {
  const [formData, setFormData] = useState({
    rooms_name: "",
    arrived_date: "",
    arrived_time: "",
    departure_date: "",
    departure_time: "",
    status: "pending",
    floor_no: "",
    remarks: "",
    type: "",
    bed_no: "",
    transaction_id: "",
    rd_id: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create booking")
      }

      setSuccess(true)
      setFormData({
        rooms_name: "",
        arrived_date: "",
        arrived_time: "",
        departure_date: "",
        departure_time: "",
        status: "pending",
        floor_no: "",
        remarks: "",
        type: "",
        bed_no: "",
        transaction_id: "",
        rd_id: "",
      })

      if (onBookingCreated) onBookingCreated()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Error creating booking:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border p-6 mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">New Booking</h3>

      {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded">{error}</div>}

      {success && <div className="mb-4 p-3 bg-chart-1/10 text-chart-1 rounded">Booking created successfully!</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Room Name</label>
          <input
            type="text"
            name="rooms_name"
            value={formData.rooms_name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Arrival Date</label>
          <input
            type="date"
            name="arrived_date"
            value={formData.arrived_date}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Departure Date</label>
          <input
            type="date"
            name="departure_date"
            value={formData.departure_date}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Floor No.</label>
          <input
            type="number"
            name="floor_no"
            value={formData.floor_no}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Bed No.</label>
          <input
            type="text"
            name="bed_no"
            value={formData.bed_no}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 bg-background border border-border rounded text-foreground"
          />
        </div>

        <Button type="submit" disabled={loading} className="md:col-span-2">
          {loading ? "Creating..." : "Create Booking"}
        </Button>
      </form>
    </Card>
  )
}
