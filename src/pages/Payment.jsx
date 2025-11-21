import React, { useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pg } = location.state || {};
  const { user: currentUser } = useAuth();
  const [txRef, setTxRef] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayNow = () => {
    if (!currentUser || !currentUser.email) {
      alert("Please login first.");
      navigate("/user-login");
      return;
    }

    if (!pg) {
      alert("No PG selected. Go back to Dashboard.");
      navigate("/user-dashboard");
      return;
    }

    // New flow: request QR for the listing (no booking yet)
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        // check if user already has a booking for this listing
        try {
          const checkRes = await apiFetch('/api/bookings', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
          const checkText = await checkRes.text();
          let all = [];
          if (checkText) { try { all = JSON.parse(checkText); } catch (e) { /* ignore */ } }
          const existing = Array.isArray(all) ? all.find(b => b.listingId === pg.id && b.status !== 'rejected' && b.status !== 'cancelled') : null;
          if (existing) {
            alert('You already have a booking for this listing.');
            navigate('/user/bookings');
            setLoading(false);
            return;
          }
        } catch (err) {
          // ignore check failures and continue to generate QR
          console.error('Booking check failed', err);
        }
        const { apiFetch, checkServer } = await import('@/lib/api');
        // quick health check before requesting QR
        const reachable = await checkServer();
        if (!reachable) {
          alert('Server unreachable. Please start the backend (default: http://localhost:5000) and try again.');
          setLoading(false);
          return;
        }
        // Request QR for this listing
        const qrRes = await apiFetch('/api/payments/upi/qr', {
          method: 'POST',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ listingId: pg.id, amount: pg.price }),
        });
        const qrText = await qrRes.text();
        let qrData = null;
        if (qrText) { try { qrData = JSON.parse(qrText); } catch (e) { console.error('Invalid QR response', qrText); } }
        if (!qrRes.ok) throw new Error(qrData?.error || qrData?.message || `QR failed (${qrRes.status})`);
        setQr(qrData?.qr || null);
        // store listing id so we can submit proof against it
        setBookingId(null);
      } catch (e) {
        console.error(e);
        alert('Failed to generate QR: ' + (e.message || e));
      } finally { setLoading(false); }
    })();
  };

  if (!pg) {
    return (
      <div className="min-h-screen flex">
        <DashboardSidebar type="user" />
        <div className="flex-1 flex items-center justify-center text-white text-xl">
          No PG selected. Go back to{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/user-dashboard")}
          >
            Dashboard
          </span>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      <DashboardSidebar type="user" />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-extrabold mb-8">💳 Payment</h1>

        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/10 max-w-lg">
          <h2 className="text-2xl font-bold mb-4">PG Details</h2>
          <p>🏠 Name: {pg.name}</p>
          <p>📍 Location: {pg.location}</p>
          <p>🛏 Room Type: {pg.type}</p>
          <p>💰 Price: ₹{pg.price}/month</p>
          <p className="text-gray-300 mb-4">Facilities: {pg.facilities}</p>

          <div className="space-y-4">
            {loading ? (
              <p>Processing...</p>
            ) : qr ? (
              <div className="text-center">
                <img src={qr} alt="UPI QR" className="mx-auto" />
                <p className="mt-2 text-sm">Scan this QR in your UPI app to pay.</p>

                <div className="mt-4">
                  <label className="block text-sm mb-2">Transaction ID (visible on screenshot)</label>
                  <input type="text" value={txRef} onChange={(e) => setTxRef(e.target.value)} className="w-full p-2 rounded-md text-black mb-2" />

                  <label className="block text-sm mb-2">Upload payment screenshot</label>
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const toBase64 = (file) => new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result);
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                    });
                    const base64 = await toBase64(f);
                    setScreenshot(base64);
                  }} className="w-full mb-2" />

                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={async () => {
                    if (!txRef) return alert('Please enter transaction id');
                    if (!screenshot) return alert('Please upload screenshot');
                    try {
                      const token = localStorage.getItem('token');
                      const { apiFetch, checkServer } = await import('@/lib/api');
                      const reachable = await checkServer();
                      if (!reachable) return alert('Server unreachable. Please start the backend (default: http://localhost:5000) and try again.');

                      const res = await apiFetch('/api/payments/upi/confirm', {
                        method: 'POST',
                        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                        body: JSON.stringify({ listingId: pg.id, txRef, screenshot, amount: pg.price }),
                      });
                      const text = await res.text();
                      let data = null;
                      if (text) { try { data = JSON.parse(text); } catch (e) { console.error('Invalid response', text); } }
                      if (!res.ok) {
                        const msg = data?.error || data?.message || `Failed (${res.status})`;
                        if ((msg || '').toLowerCase().includes('already booked')) {
                          alert('You already have a booking for this listing.');
                          navigate('/user/bookings');
                          return;
                        }
                        throw new Error(msg);
                      }
                      alert('✅ Payment submitted for verification. Status: pending');
                      navigate('/user/bookings');
                    } catch (e) {
                      console.error(e);
                      alert('Failed to submit payment: ' + (e.message || e));
                    }
                  }}>
                    Submit Payment Proof
                  </Button>
                </div>
              </div>
            ) : (
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handlePayNow}>
                Create Booking & Show QR
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;