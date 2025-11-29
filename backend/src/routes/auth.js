const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const prisma = require('../prisma');

const router = express.Router();

// ---------------- SIGNUP ----------------
router.post(
  '/signup',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('name').optional().isLength({ min: 2 }).withMessage('Name should be at least 2 characters'),
    check('role').optional().isIn(['user', 'owner']).withMessage('Role must be either user or owner'),
    check('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role = 'user', phone, gender, city } = req.body;

    // Check if email exists in correct table
    let existing = null;
    if (role === 'owner') existing = await prisma.owner.findUnique({ where: { email } });
    else existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    // Create profile
    let newProfile = null;
    try {
      const createData = { name, email, password: hashed, phone, gender, city };
      if (role === 'owner') newProfile = await prisma.owner.create({ data: createData });
      else newProfile = await prisma.user.create({ data: createData });
    } catch (err) {
      console.error('Failed to create profile', err);
      return res.status(500).json({ error: 'Failed to create profile' });
    }

    const token = jwt.sign({ id: newProfile.id, role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: newProfile.id, name: newProfile.name, email: newProfile.email, role, phone: newProfile.phone, gender: newProfile.gender, city: newProfile.city }
    });
  }
);

// ---------------- LOGIN ----------------
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').exists().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    let profile = await prisma.user.findUnique({ where: { email } });
    let role = 'user';

    if (!profile) {
      profile = await prisma.owner.findUnique({ where: { email } });
      role = 'owner';
    }

    if (!profile) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, profile.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: profile.id, role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });

    res.json({
      token,
      user: { id: profile.id, name: profile.name, email: profile.email, role, phone: profile.phone, gender: profile.gender, city: profile.city }
    });
  }
);

module.exports = router;
