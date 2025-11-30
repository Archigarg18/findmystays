// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/auth');
const listingsRouter = require('./routes/listings');
const usersRouter = require('./routes/users');
const bookingsRouter = require('./routes/bookings');
const paymentsRouter = require('./routes/payments');
const reviewsRouter = require('./routes/reviews');
const demoRouter = require('./routes/demo');
const userFiltersRouter = require('./routes/userFilters');
const wishlistRouter = require('./routes/wishlist');

const app = express();

// CORS config
app.use(cors({
  origin: "*", // restrict in production
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parse JSON with increased limit for payment screenshots
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/demo', demoRouter);
app.use('/api/user-filters', userFiltersRouter);
app.use('/api/wishlist', wishlistRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
