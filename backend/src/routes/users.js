const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../prisma');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const profile = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!profile) return res.status(404).json({ error: 'User not found' });
  const { password, ...rest } = profile;
  res.json(rest);
});

// Update current user's profile
router.patch('/me', auth, async (req, res) => {
  const { name, phone, gender, city } = req.body;
  const data = {};
  if (typeof name !== 'undefined') data.name = name;
  if (typeof phone !== 'undefined') data.phone = phone;
  if (typeof gender !== 'undefined') data.gender = gender;
  if (typeof city !== 'undefined') data.city = city;
  if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No updatable fields provided' });
  try {
    const updated = await prisma.user.update({ where: { id: req.user.id }, data });
    const { password, ...rest } = updated;
    res.json(rest);
  } catch (e) {
    console.error('Failed to update user profile', e);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
