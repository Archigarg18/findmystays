import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { apiFetch, API_BASE } from "@/lib/api";
import { toast } from "sonner";

const OwnerBookings = () => {
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingBookings(true);
        const token = localStorage.getItem('token');
        const { apiFetch } = await import('@/lib/api');
        const r = await apiFetch('/api/bookings', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        const t = await r.text();
        let d = [];
        if (t) { try { d = JSON.parse(t); } catch (e) { console.error('Invalid bookings response', t); } }
        setOwnerBookings(Array.isArray(d) ? d : []);
      } catch (e) { console.error(e); }
      finally { setLoadingBookings(false); }
    })();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      <DashboardSidebar type="owner" />
      <main className="flex-1 p-10 z-10">
        <h2 className="text-3xl font-bold mb-6">📑 Bookings</h2>
        {loadingBookings ? <p>Loading bookings...</p> : ownerBookings.length === 0 ? (
          <p className="text-gray-400">No bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {ownerBookings.map(b => (
              <div key={b.id} className="bg-slate-900 p-4 rounded-md border border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{b.listing?.name || 'Listing'}</h3>
                    <p className="text-sm">User: {b.user?.name} ({b.user?.email})</p>
                    <p className="text-sm">Amount: ₹{b.amount}</p>
                    <p className="text-sm">Status: {b.status}</p>
                    {b.txRef && <p className="text-sm">TX: {b.txRef}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {b.paymentScreenshot ? (
                      (() => {
                        let src = b.paymentScreenshot;
                        if (!src.startsWith('data:')) {
                          if (src.startsWith('/')) src = `${API_BASE}${src}`;
                          else src = `data:image/png;base64,${src}`;
                        }
                        return <img src={src} alt="proof" className="w-32 h-32 object-cover rounded-md border" />;
                      })()
                    ) : (
                      <p className="text-sm text-gray-400">No screenshot</p>
                    )}
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            const { apiFetch } = await import('@/lib/api');
                            const res = await apiFetch(`/api/bookings/${b.id}`, {
                              method: 'PATCH',
                              headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                              body: JSON.stringify({ paid: true, status: 'confirmed' }),
                            });
                            const txt = await res.text();
                            let dd = null;
                            if (txt) { try { dd = JSON.parse(txt); } catch (e) { console.error('Invalid response', txt); } }
                            if (!res.ok) throw new Error(dd?.error || dd?.message || `Failed (${res.status})`);
                            setOwnerBookings(prev => prev.map(p => p.id === b.id ? { ...p, paid: true, status: 'confirmed' } : p));
                            toast.success('Booking confirmed');
                          } catch (e) { console.error(e); toast.error(e.message || 'Failed to confirm'); }
                        }} className="bg-green-600">Confirm</Button>
                        <Button onClick={async () => {
                          try {
                            const token = localStorage.getItem('token');
                            const { apiFetch } = await import('@/lib/api');
                            const res = await apiFetch(`/api/bookings/${b.id}`, {
                              method: 'PATCH',
                              headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                              body: JSON.stringify({ status: 'rejected' }),
                            });
                            const txt = await res.text();
                            let dd = null;
                            if (txt) { try { dd = JSON.parse(txt); } catch (e) { console.error('Invalid response', txt); } }
                            if (!res.ok) throw new Error(dd?.error || dd?.message || `Failed (${res.status})`);
                            setOwnerBookings(prev => prev.filter(p => p.id !== b.id));
                            toast.success('Booking rejected');
                          } catch (e) { console.error(e); toast.error(e.message || 'Failed to reject'); }
                        }} className="bg-red-600">Reject</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerBookings;
