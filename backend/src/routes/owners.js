// Owner routes removed. Owner data is stored on User (phone, city, address).
const express = require('express');
const router = express.Router();

router.use((req, res) => res.status(410).json({ error: 'Owner endpoint removed. Use /api/users/me' }));

module.exports = router;
