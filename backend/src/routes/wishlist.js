const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../prisma');

const router = express.Router();

// ---------------- ADD TO WISHLIST ----------------
router.post('/', auth, async (req, res) => {
    const { listingId } = req.body;

    if (!listingId) {
        return res.status(400).json({ error: 'listingId is required' });
    }

    try {
        // Get listing and user details
        const listing = await prisma.listing.findUnique({ where: { id: Number(listingId) } });
        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        // Check if already in wishlist
        const existing = await prisma.wishlist.findUnique({
            where: { userId_listingId: { userId: req.user.id, listingId: Number(listingId) } }
        });

        if (existing) {
            return res.status(400).json({ error: 'Already in wishlist' });
        }

        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId: req.user.id,
                listingId: Number(listingId),
                listingName: listing.name,
                userName: user.name || 'User',
                userEmail: user.email
            },
            include: { listing: true }
        });

        res.status(201).json(wishlistItem);
    } catch (error) {
        console.error('Wishlist add error:', error);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// ---------------- REMOVE FROM WISHLIST ----------------
router.delete('/:listingId', auth, async (req, res) => {
    try {
        const deleted = await prisma.wishlist.deleteMany({
            where: {
                userId: req.user.id,
                listingId: Number(req.params.listingId)
            }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ error: 'Not in wishlist' });
        }

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Wishlist remove error:', error);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

// ---------------- GET USER'S WISHLIST ----------------
router.get('/', auth, async (req, res) => {
    try {
        const wishlist = await prisma.wishlist.findMany({
            where: { userId: req.user.id },
            include: { listing: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json(wishlist);
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

module.exports = router;
