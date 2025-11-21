const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const prisma = require('../prisma');

const router = express.Router();

// Signup
router.post(
  '/signup',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('name').optional().isLength({ min: 2 }).withMessage('Name should be at least 2 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role = 'user', phone, gender, city } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    // Try to include optional fields if the DB schema supports them. If not, fallback to creating without them.
    let user = null;
    try {
  const createData = { name, email, password: hashed, role };
  if (typeof phone !== 'undefined') createData.phone = phone;
  if (typeof gender !== 'undefined') createData.gender = gender;
  if (typeof city !== 'undefined') createData.city = city;
      user = await prisma.user.create({ data: createData });
    } catch (e) {
      // Fallback: try without optional fields
      try {
        user = await prisma.user.create({ data: { name, email, password: hashed, role } });
      } catch (err) {
        console.error('Failed to create user', err);
        return res.status(500).json({ error: 'Failed to create user' });
      }
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, gender: user.gender, city: user.city } });
  }
);

// Login
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
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, gender: user.gender, city: user.city } });
  }
);

module.exports = router;
