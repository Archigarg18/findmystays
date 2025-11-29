const express = require('express');
const auth = require('../middleware/auth');
const prisma = require('../prisma');
let QRCode = null;
const fs = require('fs');
const path = require('path');
try {
  QRCode = require('qrcode');
} catch (e) {
  console.warn('Optional dependency "qrcode" is not installed. Install it to enable UPI QR generation.');
}

const router = express.Router();

async function saveScreenshot(dataUrlOrBase64) {
  if (!dataUrlOrBase64) return null;
  let matches = String(dataUrlOrBase64).match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
  let ext = 'png';
  let base64 = dataUrlOrBase64;
  if (matches) {
    const mime = matches[1];
    base64 = matches[2];
    ext = mime.split('/')[1] || 'png';
  } else {
    base64 = String(dataUrlOrBase64).replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  }

  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'payments');
  fs.mkdirSync(uploadsDir, { recursive: true });
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,9)}.${ext}`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
  return `/uploads/payments/${fileName}`;
}

// ---------------- GENERATE UPI QR ----------------
router.post('/upi/qr', auth, async (req, res) => {
  const { bookingId, listingId } = req.body;
  let listing = null;
  let booking = null;

  if (bookingId) {
    booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: { listing: { include: { owner: true } } }
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.userId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    if (booking.paid) return res.status(400).json({ error: 'Already paid' });
    listing = booking.listing;
  } else if (listingId) {
    listing = await prisma.listing.findUnique({
      where: { id: Number(listingId) },
      include: { owner: true }
    });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
  } else {
    return res.status(400).json({ error: 'bookingId or listingId required' });
  }

  const upiId = listing?.upiId;
  if (!upiId) return res.status(400).json({ error: 'Owner has not configured UPI ID' });

  const amount = (booking && booking.amount) ? booking.amount : (req.body.amount ? Number(req.body.amount) : (listing.price || 0));
  const pa = encodeURIComponent(upiId);
  const pn = encodeURIComponent(listing.owner?.name || '');
  const am = encodeURIComponent(String(amount));
  const tn = encodeURIComponent(booking ? `Booking ${booking.id}` : `Payment for ${listing.name || listing.id}`);
  const upiUri = `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;

  if (!QRCode) return res.status(500).json({ error: 'Server missing qrcode dependency. Run `npm install qrcode`.' });

  try {
    const dataUrl = await QRCode.toDataURL(upiUri);
    res.json({ qr: dataUrl, upiUri, amount, listingId: listing.id, bookingId: booking ? booking.id : null });
  } catch (e) {
    console.error('Failed to generate QR code', e);
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// ---------------- CONFIRM UPI PAYMENT ----------------
router.post('/upi/confirm', auth, async (req, res) => {
  const { bookingId, listingId, txRef, screenshot, amount } = req.body;

  if (!bookingId && !listingId) return res.status(400).json({ error: 'bookingId or listingId required' });

  if (bookingId) {
    const booking = await prisma.booking.findUnique({ where: { id: Number(bookingId) } });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.userId !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    if (booking.paid) return res.status(400).json({ error: 'Already paid' });

    const data = { status: 'pending' };
    if (txRef) data.txRef = txRef;
    if (screenshot) {
      try { data.paymentScreenshot = await saveScreenshot(screenshot); } catch (e) { console.error('Failed to save screenshot', e); }
    }
    await prisma.booking.update({ where: { id: Number(bookingId) }, data });
    return res.json({ ok: true, bookingId });
  }

  // create booking for listingId and attach proof
  const listing = await prisma.listing.findUnique({ where: { id: Number(listingId) } });
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const existing = await prisma.booking.findUnique({
    where: { userId_listingId: { userId: req.user.id, listingId: Number(listingId) } }
  }).catch(() => null);
  if (existing) return res.status(400).json({ error: 'You have already booked this listing' });

  let savedScreenshot = null;
  if (screenshot) {
    try { savedScreenshot = await saveScreenshot(screenshot); } catch (e) { console.error('Failed to save screenshot', e); }
  }

  const booking = await prisma.booking.create({
    data: {
      listingId: Number(listingId),
      userId: req.user.id,
      ownerId: listing.ownerId,
      amount: amount ? Number(amount) : (listing.price || 0),
      status: 'pending',
      txRef: txRef || undefined,
      paymentScreenshot: savedScreenshot || undefined
    }
  });

  res.status(201).json({ ok: true, bookingId: booking.id });
});

module.exports = router;
