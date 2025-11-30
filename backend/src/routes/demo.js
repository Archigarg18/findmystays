const express = require('express');
const prisma = require('../prisma');
const router = express.Router();

// ---------------- SEED DATA ----------------
// ---------------- SEED DATA ----------------
router.post('/seed', async (req, res) => {
    try {
        const COUNT = 30;
        const owners = [];
        const users = [];
        const listings = [];
        const bookings = [];
        const payments = [];
        const reviews = [];
        const userFilters = [];

        // 1. Create 30 Dummy Owners
        for (let i = 0; i < COUNT; i++) {
            const owner = await prisma.owner.create({
                data: {
                    name: `Owner ${i + 1}`,
                    email: `owner${Date.now()}_${i}@demo.com`,
                    password: 'password123',
                    phone: `999${String(i).padStart(7, '0')}`,
                    city: 'Demo City'
                }
            });
            owners.push(owner);
        }

        // 2. Create 30 Dummy Users
        for (let i = 0; i < COUNT; i++) {
            const user = await prisma.user.create({
                data: {
                    name: `User ${i + 1}`,
                    email: `user${Date.now()}_${i}@demo.com`,
                    password: 'password123',
                    phone: `888${String(i).padStart(7, '0')}`,
                    city: 'User City'
                }
            });
            users.push(user);
        }

        // 3. Create 30 Listings (assigned to random owners)
        for (let i = 0; i < COUNT; i++) {
            const randomOwner = owners[Math.floor(Math.random() * owners.length)];
            const listing = await prisma.listing.create({
                data: {
                    ownerId: randomOwner.id,
                    name: `PG Listing ${i + 1}`,
                    description: `This is a description for PG Listing ${i + 1}`,
                    price: 5000 + (i * 100),
                    location: `Location ${i + 1}`,
                    type: i % 2 === 0 ? 'Single' : 'Double',
                    facilities: 'Wifi, AC, Food'
                }
            });
            listings.push(listing);
        }

        // 4. Create 30 Bookings
        for (let i = 0; i < COUNT; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomListing = listings[Math.floor(Math.random() * listings.length)];

            // Find owner of the listing
            const listingOwnerId = randomListing.ownerId;

            const booking = await prisma.booking.create({
                data: {
                    listingId: randomListing.id,
                    userId: randomUser.id,
                    ownerId: listingOwnerId,
                    amount: randomListing.price,
                    status: 'completed',
                    paid: true
                }
            });
            bookings.push(booking);
        }

        // 5. Create 30 Payments
        for (let i = 0; i < COUNT; i++) {
            const booking = bookings[i];
            const payment = await prisma.payment.create({
                data: {
                    bookingId: booking.id,
                    amount: booking.amount,
                    status: 'completed',
                    upiTransactionId: `TXN${Date.now()}_${i}`
                }
            });
            payments.push(payment);
        }

        // 6. Create 30 Reviews
        for (let i = 0; i < COUNT; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomListing = listings[Math.floor(Math.random() * listings.length)];

            const review = await prisma.review.create({
                data: {
                    userId: randomUser.id,
                    listingId: randomListing.id,
                    rating: Math.floor(Math.random() * 5) + 1,
                    comment: `Review comment ${i + 1}`
                }
            });
            reviews.push(review);
        }

        // 7. Create 30 UserFilters
        for (let i = 0; i < COUNT; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const filter = await prisma.userFilter.create({
                data: {
                    userId: randomUser.id,
                    filterName: 'price_range',
                    filterValue: `${1000 * i}-${2000 * i}`
                }
            });
            userFilters.push(filter);
        }

        res.json({
            message: `Seeding successful! Created ${COUNT} records for each entity.`,
            counts: {
                owners: owners.length,
                users: users.length,
                listings: listings.length,
                bookings: bookings.length,
                payments: payments.length,
                reviews: reviews.length,
                userFilters: userFilters.length
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// ---------------- ADVANCED SQL: VIEW ----------------
router.get('/payment-details', async (req, res) => {
    try {
        // Query the View using raw SQL
        const results = await prisma.$queryRaw`SELECT * FROM PaymentDetailsView`;
        // Convert BigInt to string if necessary (Prisma returns BigInt for some SQL types)
        const serialized = JSON.parse(JSON.stringify(results, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
        res.json(serialized);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ---------------- ADVANCED SQL: FUNCTION ----------------
router.get('/user-spend/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const result = await prisma.$queryRaw`SELECT GetTotalUserSpend(${userId}) as total`;
        res.json({ userId, totalSpend: result[0].total });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ---------------- ADVANCED SQL: PROCEDURE ----------------
router.post('/archive-filters', async (req, res) => {
    try {
        await prisma.$executeRaw`CALL ArchiveOldFilters()`;
        res.json({ message: 'Procedure executed successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
