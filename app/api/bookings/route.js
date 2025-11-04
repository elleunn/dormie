import { addBooking, getBookings } from "@/lib/db"

export async function GET() {
  try {
    const bookings = await getBookings()
    return Response.json({ bookings })
  } catch (err) {
    console.error("[v0] Query error", err)
    return Response.json({ error: "Failed to query bookings" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const booking = await req.json()
    const inserted = await addBooking(booking)
    return Response.json({ booking: inserted }, { status: 201 })
  } catch (err) {
    console.error("[v0] Insert error", err)
    if (err.code === "BAD_INPUT") {
      return Response.json({ error: err.message }, { status: 400 })
    }
    return Response.json({ error: "Failed to insert booking" }, { status: 500 })
  }
}
