require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const listingsRouter = require('./routes/listings');
const usersRouter = require('./routes/users');
const bookingsRouter = require('./routes/bookings');
const paymentsRouter = require('./routes/payments');

const app = express();


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Increase JSON body size to allow base64 screenshots for payment proof
app.use(express.json({ limit: '10mb' }));

const path = require('path');
// Serve uploaded files under /uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);

// simple health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
