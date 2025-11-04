// db.js — Neon/Postgres helper with addBooking() and getBookings()
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.warn('Warning: DATABASE_URL not set. Set it to your Neon connection string in a .env file.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || '',
  // For many Neon setups use SSL but skip strict CA validation (adjust per your environment)
  ssl: process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

async function init() {
  // create table if not exists (you can remove if you manage schema elsewhere)
  const createSql = `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      date_accept DATE,
      status TEXT,
      transaction_id TEXT,
      arrived_date DATE,
      arrived_time TEXT,
      departure_date DATE,
      departure_time TEXT,
      rd_id INT,
      floor_no INT,
      remarks TEXT,
      rooms_name TEXT,
      type TEXT,
      bed_no TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `;
  await pool.query(createSql);
}

/**
 * addBooking(booking)
 * booking: object with keys matching table columns (strings or nulls)
 * returns inserted row
 */
async function addBooking(booking) {
  if (!booking || typeof booking !== 'object') {
    const err = new Error('booking object required');
    err.code = 'BAD_INPUT';
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

  const rdIdNum = (rd_id === null || rd_id === undefined || rd_id === '') ? null : Number(rd_id);
  const floorNoNum = (floor_no === null || floor_no === undefined || floor_no === '') ? null : Number(floor_no);

  const sql = `
    INSERT INTO bookings
      (date_accept, status, transaction_id, arrived_date, arrived_time, departure_date, departure_time,
       rd_id, floor_no, remarks, rooms_name, type, bed_no)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *;
  `;
  const params = [
    date_accept || null,
    status || null,
    transaction_id || null,
    arrived_date || null,
    arrived_time || null,
    departure_date || null,
    departure_time || null,
    Number.isFinite(rdIdNum) ? rdIdNum : null,
    Number.isFinite(floorNoNum) ? floorNoNum : null,
    remarks || null,
    rooms_name || null,
    type || null,
    bed_no || null,
  ];

  const { rows } = await pool.query(sql, params);
  return rows[0];
}

async function getBookings() {
  const res = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
  return res.rows;
}

module.exports = {
  pool,
  init,
  addBooking,
  getBookings,
};