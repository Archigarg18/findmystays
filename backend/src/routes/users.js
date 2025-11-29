const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const prisma = require('../prisma');
const router = express.Router();

// ---------------- GET CURRENT USER PROFILE ----------------
router.get('/me', auth, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ error: 'Not a user' });
  const profile = await prisma.user.findUnique({ where: { id: Number(req.user.id) } });
  if (!profile) return res.status(404).json({ error: 'User not found' });
  const { password, ...rest } = profile;
  res.json(rest);
});

// ---------------- UPDATE USER PROFILE ----------------
router.patch(
  '/me',
  auth,
  [
    check('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    check('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),
    check('gender').optional().isString(),
    check('city').optional().isString()
  ],
  async (req, res) => {
    if (req.user.role !== 'user') return res.status(403).json({ error: 'Not a user' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, phone, gender, city } = req.body;
    const data = {};
    if (typeof name !== 'undefined') data.name = name;
    if (typeof phone !== 'undefined') data.phone = phone;
    if (typeof gender !== 'undefined') data.gender = gender;
    if (typeof city !== 'undefined') data.city = city;

    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No updatable fields provided' });

    try {
      const updated = await prisma.user.update({ where: { id: Number(req.user.id) }, data });
      const { password, ...rest } = updated;
      res.json(rest);
    } catch (e) {
      console.error('Failed to update user profile', e);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

module.exports = router;
