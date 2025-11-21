import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";

const UserBooking = () => {
  const [bookings, setBookings] = useState([]);
  const { user: currentUser } = useAuth();
  const [selected, setSelected] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [txRefInput, setTxRefInput] = useState('');
  const [screenshotInput, setScreenshotInput] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const token = currentUser?.token || localStorage.getItem('token');
  const res = await apiFetch('/api/bookings', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  const text = await res.text();
        let data = [];
        if (text) { try { data = JSON.parse(text); } catch (e) { console.error('Invalid bookings response', text); } }
        setBookings(Array.isArray(data) ? data : []);
      } catch (e) { console.error(e); }
    })();
  }, [currentUser]);

  const handleCancel = (id) => {
    (async () => {
      try {
        const token = currentUser?.token || localStorage.getItem('token');
        const res = await apiFetch(`/api/bookings/${id}`, {
          method: 'PATCH',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ status: 'cancelled' }),
        });
        const text = await res.text();
        let data = null;
        if (text) { try { data = JSON.parse(text); } catch (e) { console.error('Invalid response', text); } }
        if (!res.ok) throw new Error(data?.error || data?.message || `Cancel failed (${res.status})`);
        setBookings((prev) => prev.filter((b) => b.id !== id));
        alert('Booking cancelled successfully!');
      } catch (e) {
        console.error(e);
        alert('Failed to cancel booking: ' + (e.message || e));
      }
    })();
  };

  const handleMakePayment = async (b) => {
    setSelected(b);
    setLoadingQr(true);
    try {
  const token = currentUser?.token || localStorage.getItem('token');
      const res = await apiFetch('/api/payments/upi/qr', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ bookingId: b.id }),
      });

      const text = await res.text();
      let data = null;
      if (text) {
        try { data = JSON.parse(text); } catch (e) { throw new Error(`Invalid server response: ${text}`); }
      }

      if (!res.ok) {
        toast({ title: 'Failed to generate QR', description: data?.error || data?.message || `Server error ${res.status}`, variant: 'destructive' });
        setQrData(null);
      } else {
        setQrData(data?.qr || null);
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Could not generate QR', variant: 'destructive' });
    } finally {
      setLoadingQr(false);
    }
  };

  const confirmPaid = async (b) => {
    try {
      const token = currentUser?.token || localStorage.getItem('token');
      // send txRef and screenshot to mark booking pending verification
      const res = await apiFetch('/api/payments/upi/confirm', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ bookingId: b.id, txRef: txRefInput, screenshot: screenshotInput }),
      });

      const text = await res.text();
      let data = null;
      if (text) {
        try { data = JSON.parse(text); } catch (e) { throw new Error(`Invalid server response: ${text}`); }
      }

      if (!res.ok) {
        toast({ title: 'Failed to submit payment proof', description: data?.error || data?.message || `Server error ${res.status}`, variant: 'destructive' });
      } else {
        // refresh bookings from server
        const token2 = currentUser?.token || localStorage.getItem('token');
        const r2 = await apiFetch('/api/bookings', { headers: { ...(token2 ? { Authorization: `Bearer ${token2}` } : {}) } });
        const t2 = await r2.text();
        let d2 = [];
        if (t2) { try { d2 = JSON.parse(t2); } catch (e) { console.error('Invalid bookings response', t2); } }
        setBookings(Array.isArray(d2) ? d2 : []);
        toast({ title: 'Payment submitted', description: 'Waiting for owner verification' });
        setSelected(null);
        setQrData(null);
        setTxRefInput('');
        setScreenshotInput(null);
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Could not submit payment proof', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      <DashboardSidebar type="user" />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-extrabold mb-8">📦 My Bookings</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-400">No bookings yet. Go to Dashboard to book a PG.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/10"
              >
                <h3 className="text-2xl font-bold mb-2">{b.name || b.listing?.name || 'Untitled listing'}</h3>
                { (b.location || b.listing?.location) && <p>📍 {b.location || b.listing?.location}</p> }
                { (b.type || b.listing?.type) && <p>🛏 {b.type || b.listing?.type}</p> }
                { (b.price || b.listing?.price) && <p>💰 ₹{b.price || b.listing?.price}</p> }
                { (b.facilities || b.listing?.facilities) && <p className="text-sm text-gray-300 mb-3">{b.facilities || b.listing?.facilities}</p> }
                <p className="mt-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${b.status === 'confirmed' || b.paid ? 'bg-green-600 text-white' : b.status === 'cancelled' || b.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-black'}`}>
                    { (b.status && b.status[0]?.toUpperCase() + b.status.slice(1)) || (b.paid ? 'Paid' : 'Pending') }
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* Payment QR Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) { setSelected(null); setQrData(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay via UPI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {loadingQr ? (
              <p>Generating QR...</p>
            ) : qrData ? (
              <div className="text-center">
                <img src={qrData} alt="UPI QR" className="mx-auto" />
                <p className="mt-2 text-sm">Scan this QR in your UPI app to pay.</p>
                <div className="mt-4">
                  <input type="text" placeholder="Transaction ID" className="w-full p-2 rounded-md text-black mb-2" value={txRefInput} onChange={(e) => setTxRefInput(e.target.value)} />
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
                    setScreenshotInput(base64);
                  }} className="w-full mb-2" />
                  <Button className="mt-2 w-full" onClick={() => confirmPaid(selected)}>
                    Submit Payment Proof
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm">No QR available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserBooking;