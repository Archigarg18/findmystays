const express = require('express');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const prisma = require('../prisma');

const router = express.Router();

// ---------------- CREATE REVIEW ----------------
router.post(
    '/',
    auth,
    [
        check('listingId').notEmpty().withMessage('listingId is required'),
        check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        check('comment').optional().isString()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { listingId, rating, comment } = req.body;

        // Verify listing exists
        const listing = await prisma.listing.findUnique({ where: { id: Number(listingId) } });
        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        // Optional: Check if user has booked this listing
        // const booking = await prisma.booking.findFirst({
        //   where: { userId: req.user.id, listingId: Number(listingId) }
        // });
        // if (!booking) return res.status(403).json({ error: 'You must book this listing to review it' });

        const review = await prisma.review.create({
            data: {
                userId: req.user.id,
                listingId: Number(listingId),
                rating: Number(rating),
                comment: comment || null
            },
            include: { user: true }
        });

        res.status(201).json(review);
    }
);

// ---------------- GET REVIEWS FOR LISTING ----------------
router.get('/:listingId', async (req, res) => {
    const reviews = await prisma.review.findMany({
        where: { listingId: Number(req.params.listingId) },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
});

// ---------------- CREATE GUEST REVIEW (NO AUTH) ----------------
router.post('/guest', async (req, res) => {
    const { listingId, rating, comment, guestName, guestEmail } = req.body;

    if (!listingId || !rating) {
        return res.status(400).json({ error: 'listingId and rating are required' });
    }

    try {
        // Find or create a guest user with this email
        let guestUser = await prisma.user.findUnique({
            where: { email: guestEmail }
        });

        if (!guestUser) {
            // Create a new guest user
            guestUser = await prisma.user.create({
                data: {
                    email: guestEmail,
                    name: guestName || 'Guest',
                    password: 'guest_no_password', // Guest users can't login
                    phone: '0000000000'
                }
            });
        }

        // Verify listing exists
        const listing = await prisma.listing.findUnique({ where: { id: Number(listingId) } });
        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        const review = await prisma.review.create({
            data: {
                userId: guestUser.id,
                listingId: Number(listingId),
                rating: Number(rating),
                comment: comment || null,
                userName: guestName || null,
                userEmail: guestEmail || null
            },
            include: { user: true }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Guest review error:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

module.exports = router;
