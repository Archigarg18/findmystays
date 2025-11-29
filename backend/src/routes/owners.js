const express = require('express');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const router = express.Router();

// ---------------- GET OWNER PROFILE ----------------
router.get('/me', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Not an owner' });
  const owner = await prisma.owner.findUnique({ where: { id: req.user.id } });
  if (!owner) return res.status(404).json({ error: 'Owner not found' });
  res.json(owner);
});

// ---------------- UPDATE OWNER PROFILE ----------------
router.put(
  '/me',
  auth,
  [
    check('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    check('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),
    check('city').optional().isString(),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    if (req.user.role !== 'owner') return res.status(403).json({ error: 'Not an owner' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, phone, city, password } = req.body;
    const data = {};
    if (name) data.name = name;
    if (phone) data.phone = phone;
    if (city) data.city = city;
    if (password) data.password = await bcrypt.hash(password, 10);

    const updated = await prisma.owner.update({ where: { id: req.user.id }, data });
    res.json(updated);
  }
);

// ---------------- LIST ALL OWNERS (ADMIN) ----------------
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Not authorized' });
  const owners = await prisma.owner.findMany();
  res.json(owners);
});

module.exports = router;

