// server.js — Express server exposing POST /api/bookings and GET /api/bookings
require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  try {
    await db.init();
    console.log('DB initialized');
  } catch (err) {
    console.error('DB init failed', err);
    process.exit(1);
  }

  // create booking
  app.post('/api/bookings', async (req, res) => {
    try {
      const booking = req.body || {};
      const inserted = await db.addBooking(booking);
      return res.status(201).json({ booking: inserted });
    } catch (err) {
      console.error('Insert error', err);
      if (err.code === 'BAD_INPUT') return res.status(400).json({ error: err.message });
      return res.status(500).json({ error: 'Failed to insert booking' });
    }
  });

  // list bookings
  app.get('/api/bookings', async (req, res) => {
    try {
      const bookings = await db.getBookings();
      res.json({ bookings });
    } catch (err) {
      console.error('Query error', err);
      res.status(500).json({ error: 'Failed to query bookings' });
    }
  });

  // serve main UI (index.html)
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server listening: http://localhost:${PORT}`);
  });
})();