const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

module.exports = async function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing auth header' });
  const parts = auth.split(' ');
  if (parts[0] !== 'Bearer' || !parts[1]) return res.status(401).json({ error: 'Invalid auth header' });
  try {
    const secret = process.env.JWT_SECRET || 'devsecret';
    if (secret === 'devsecret') console.warn('Using default JWT secret. Set JWT_SECRET in .env for production.');
    const payload = jwt.verify(parts[1], secret);
    req.user = payload;
    // fetch fresh profile from DB
    const profile = await prisma.user.findUnique({ where: { id: payload.id } });
    req.user.profile = profile || null;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
