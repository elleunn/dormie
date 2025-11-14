// backend/server.js
const express = require('express');
const cors = require('cors');
const { init, addBooking, getBookings } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database table
init().then(() => console.log('Database initialized')).catch(console.error);

// Routes
app.get('/api/bookings', async (req, res) => {
  try {
    const rows = await getBookings();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await addBooking(req.body);
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
