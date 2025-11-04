import pkg from "pg";
const { Pool } = pkg;

// ✅ Use your Neon connection string here
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_8s7xJrZaQPXE@ep-billowing-art-a1fsspe9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
});

export async function addBooking(booking) {
  if (!booking || typeof booking !== "object") {
    const err = new Error("booking object required");
    err.code = "BAD_INPUT";
    throw err;
  }

  const {
    date_accept = null,
    status = null,
    transaction_id = null,
    arrived_date = null,
    arrived_time = null,
    departure_date = null,
    departure_time = null,
    rd_id = null,
    floor_no = null,
    remarks = null,
    rooms_name = null,
    type = null,
    bed_no = null,
  } = booking;

  const query = `
    INSERT INTO bookings (
      date_accept, status, transaction_id, arrived_date, arrived_time,
      departure_date, departure_time, rd_id, floor_no, remarks, rooms_name, type, bed_no
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *;
  `;

  const values = [
    date_accept,
    status,
    transaction_id,
    arrived_date,
    arrived_time,
    departure_date,
    departure_time,
    rd_id ? Number(rd_id) : null,
    floor_no ? Number(floor_no) : null,
    remarks,
    rooms_name,
    type,
    bed_no,
  ];

  const client = await pool.connect();
  try {
    const res = await client.query(query, values);
    return res.rows[0];
  } finally {
    client.release();
  }
}

export async function getBookings() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM bookings ORDER BY arrived_date DESC;");
    return res.rows;
  } finally {
    client.release();
  }
}
