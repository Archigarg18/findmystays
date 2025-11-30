const express = require('express');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const prisma = require('../prisma');

const router = express.Router();

// ---------------- CREATE BOOKING ----------------
router.post(
  '/',
  auth,
  [
    check('listingId').notEmpty().withMessage('listingId required'),
    check('amount').optional().isNumeric().withMessage('amount must be a number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { listingId, amount } = req.body;
    const listing = await prisma.listing.findUnique({ where: { id: Number(listingId) } });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // prevent duplicate booking by same user for same listing
    const existing = await prisma.booking.findUnique({
      where: { userId_listingId: { userId: req.user.id, listingId: Number(listingId) } }
    }).catch(() => null);

    if (existing) return res.status(400).json({ error: 'You have already booked this listing' });

    const booking = await prisma.booking.create({
      data: {
        listingId: Number(listingId),
        userId: req.user.id,
        ownerId: listing.ownerId, // Owner table
        amount: amount ? Number(amount) : (listing.price || 0)
      },
      include: {
        listing: true,
        user: true
      }
    });

    res.status(201).json(booking);
  }
);

// ---------------- GET BOOKINGS ----------------
router.get('/', auth, async (req, res) => {
  const isOwner = req.user.role === 'owner';
  let results;
  if (isOwner) {
    results = await prisma.booking.findMany({
      where: { ownerId: req.user.id },
      include: {
        listing: true,
        user: true,
        // optionally include owner info
        // owner: true
      }
    });
  } else {
    results = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { listing: true, user: true }
    });
  }
  res.json(results);
});

// ---------------- UPDATE BOOKING ----------------
router.patch(
  '/:id',
  auth,
  [
    check('paid').optional().isBoolean().withMessage('paid must be boolean'),
    check('status').optional().isString().withMessage('status must be a string')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { paid, status } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const isAdmin = req.user.role === 'admin';
    const isBookingUser = booking.userId === req.user.id;
    const isListingOwner = booking.ownerId === req.user.id;

    if (!(isBookingUser || isListingOwner || isAdmin)) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    const data = {};
    if (typeof paid !== 'undefined') data.paid = paid === true || paid === 'true' || paid === 1 || paid === '1';
    if (typeof status !== 'undefined') data.status = status;

    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No updatable fields provided' });

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data,
      include: { listing: true, user: true }
    });

    // Update Payment status when booking is confirmed/completed
    if (status && (status === 'confirmed' || status === 'completed' || status === 'approved')) {
      try {
        await prisma.payment.updateMany({
          where: { bookingId: Number(id) },
          data: { status: 'completed' }
        });
      } catch (e) {
        console.error('Failed to update payment status:', e);
      }
    }

    res.json(updated);
  }
);

module.exports = router;
