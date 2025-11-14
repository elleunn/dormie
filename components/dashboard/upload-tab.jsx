"use client"

import { useState } from "react"
import { UploadIcon } from "lucide-react"

export function UploadTab() {
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
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
const response = await fetch("https://dormie-backend.onrender.com/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
})
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create booking")
      }

      setMessageType("success")
      setMessage("Booking created successfully!")
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

      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.log("[v0] Error:", error.message)
      setMessageType("error")
      setMessage(error.message || "Error creating booking. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <UploadIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Add New Booking</h1>
                <p className="text-foreground/60">Create a new dormitory booking entry</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-lg border border-border p-6">
            {message && (
              <div
                className={`mb-4 p-4 rounded-lg ${
                  messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Room Name *</label>
                  <input
                    type="text"
                    name="rooms_name"
                    value={formData.rooms_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Room 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Arrival Date *</label>
                  <input
                    type="date"
                    name="arrived_date"
                    value={formData.arrived_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Arrival Time</label>
                  <input
                    type="time"
                    name="arrived_time"
                    value={formData.arrived_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Departure Date *</label>
                  <input
                    type="date"
                    name="departure_date"
                    value={formData.departure_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Departure Time</label>
                  <input
                    type="time"
                    name="departure_time"
                    value={formData.departure_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Floor No.</label>
                  <input
                    type="number"
                    name="floor_no"
                    value={formData.floor_no}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bed No.</label>
                  <input
                    type="text"
                    name="bed_no"
                    value={formData.bed_no}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., A1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Couple/Bedspace"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Transaction ID</label>
                  <input
                    type="text"
                    name="transaction_id"
                    value={formData.transaction_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">RD ID</label>
                  <input
                    type="text"
                    name="rd_id"
                    value={formData.rd_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Additional remarks or notes"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading ? "Creating..." : "Create Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
