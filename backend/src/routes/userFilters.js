const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../prisma');

const router = express.Router();

// ---------------- SAVE USER FILTER ----------------
router.post('/', auth, async (req, res) => {
    const { filterName, filterValue } = req.body;

    if (!filterName || !filterValue) {
        return res.status(400).json({ error: 'filterName and filterValue are required' });
    }

    try {
        const userFilter = await prisma.userFilter.create({
            data: {
                userId: req.user.id,
                filterName,
                filterValue
            }
        });

        res.status(201).json(userFilter);
    } catch (error) {
        console.error('UserFilter error:', error);
        res.status(500).json({ error: 'Failed to save filter' });
    }
});

// ---------------- GET USER FILTERS ----------------
router.get('/', auth, async (req, res) => {
    try {
        const filters = await prisma.userFilter.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 10 // Last 10 filters
        });

        res.json(filters);
    } catch (error) {
        console.error('Get filters error:', error);
        res.status(500).json({ error: 'Failed to fetch filters' });
    }
});

module.exports = router;
