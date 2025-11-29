const express = require('express');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const prisma = require('../prisma');
const router = express.Router();

// ---------------- GET ALL LISTINGS ----------------
router.get('/', async (req, res) => {
  const listings = await prisma.listing.findMany({
    include: { owner: true } // fetch owner info from Owner table
  });
  res.json(listings || []);
});

// ---------------- CREATE LISTING ----------------
router.post(
  '/',
  auth,
  [
    check('name').isLength({ min: 2 }).withMessage('Name is required and should be at least 2 characters'),
    check('price').optional().isNumeric().withMessage('Price must be a number')
  ],
  async (req, res) => {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only owners can create listings' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const data = {
      ownerId: req.user.id,
      name: req.body.name,
      description: req.body.description || null,
      location: req.body.location || null,
      price: req.body.price ? Number(req.body.price) : null,
      upiId: req.body.upiId || null,
      type: req.body.type || null,
      facilities: req.body.facilities || null,
      createdAt: new Date()
    };

    const listing = await prisma.listing.create({ data });
    res.status(201).json(listing);
  }
);

// ---------------- GET ONE LISTING ----------------
router.get('/:id', async (req, res) => {
  const l = await prisma.listing.findUnique({
    where: { id: Number(req.params.id) },
    include: { owner: true } // include owner info
  });
  if (!l) return res.status(404).json({ error: 'Not found' });
  res.json(l);
});

// ---------------- UPDATE LISTING ----------------
router.put('/:id', auth, async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: Number(req.params.id) } });
  if (!listing) return res.status(404).json({ error: 'Not found' });
  if (listing.ownerId !== req.user.id) return res.status(403).json({ error: 'Not owner' });

  const updated = await prisma.listing.update({
    where: { id: Number(req.params.id) },
    data: { ...req.body, updatedAt: new Date() }
  });
  res.json(updated);
});

// ---------------- DELETE LISTING ----------------
router.delete('/:id', auth, async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: Number(req.params.id) } });
  if (!listing) return res.status(404).json({ error: 'Not found' });
  if (listing.ownerId !== req.user.id) return res.status(403).json({ error: 'Not owner' });

  await prisma.listing.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

module.exports = router;
