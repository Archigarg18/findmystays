import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const OwnerDashboard = () => {
  const { toast } = useToast();

  // State for PGs
  const [myPGs, setMyPGs] = useState([]);
  const [loading, setLoading] = useState(false);
  // Owner bookings
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // fetch listings and filter by current owner
    (async () => {
      try {
        setLoading(true);
  const { apiFetch } = await import('@/lib/api');
  const res = await apiFetch('/api/listings');
  const text = await res.text();
        let data = [];
        if (text) { try { data = JSON.parse(text); } catch (e) { console.error('Invalid listings response', text); } }
  const ownerId = user?.id;
        const mine = Array.isArray(data) ? data.filter(l => l.ownerId === ownerId) : [];
        setMyPGs(mine);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
  })();
    // fetch owner bookings
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
  }, [user]);

  // Form states
  const [pgName, setPgName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [upiId, setUpiId] = useState("");
  const [roomType, setRoomType] = useState("");
  const [facilities, setFacilities] = useState("");

  // Edit modal states
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Add new PG
  const handleAddPG = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { apiFetch } = await import('@/lib/api');
      const res = await apiFetch('/api/listings', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ name: pgName, location, price: Number(price || 0), type: roomType, facilities, upiId }),
      });
      const text = await res.text();
      let data = null;
      if (text) { try { data = JSON.parse(text); } catch (e) { throw new Error(`Invalid server response: ${text}`); } }
      if (!res.ok) throw new Error(data?.error || data?.message || `Create failed (${res.status})`);
      setMyPGs(prev => [data, ...prev]);
      toast({ title: '✅ PG Added Successfully!' });
      setPgName(''); setLocation(''); setPrice(''); setRoomType(''); setFacilities(''); setUpiId('');
    } catch (e) {
      console.error(e);
      toast({ title: 'Failed to add PG', description: e.message || 'Server error', variant: 'destructive' });
    }
  };

  // Delete PG
  const handleDeletePG = (index) => {
    const updated = myPGs.filter((_, i) => i !== index);
    setMyPGs(updated);
    toast({ title: "🗑️ PG Deleted Successfully!" });
  };

  // Open edit modal
  const handleEditPG = (index) => {
    const pg = myPGs[index];
    setPgName(pg.name);
    setLocation(pg.location);
    setPrice(pg.price);
  setUpiId(pg.upiId || "");
    setRoomType(pg.roomType || "");
    setFacilities(pg.facilities || "");
    setEditIndex(index);
    setIsEditing(true);
  };

  // Save edited PG
  const handleUpdatePG = () => {
    const updatedPGs = [...myPGs];
    updatedPGs[editIndex] = { ...updatedPGs[editIndex], name: pgName, location, price, roomType, facilities, upiId };
    setMyPGs(updatedPGs);
    setIsEditing(false);
    toast({ title: "✅ PG Updated Successfully!" });
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      <DashboardSidebar type="owner" />

      <main className="flex-1 p-10 z-10 space-y-10">
        {/* Add PG Section */}
        <section id="addpg" className="glass-card rounded-2xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">➕ Add New PG</h2>
          <form className="space-y-4" onSubmit={handleAddPG}>
            <Input
              type="text"
              placeholder="PG/Hostel Name"
              value={pgName}
              onChange={(e) => setPgName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Price per Month"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <Input
              type="text"
              placeholder="Owner UPI ID (e.g. owner@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />

            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="triple">Triple</SelectItem>
                <SelectItem value="quad">Quad</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Facilities (WiFi, Food, AC...)"
              value={facilities}
              onChange={(e) => setFacilities(e.target.value)}
            />

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Add PG
            </Button>
          </form>
        </section>

        {/* Owner Bookings Section */}
        <section id="bookings" className="glass-card rounded-2xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">📑 Bookings</h2>
          {loadingBookings ? (
            <p>Loading bookings...</p>
          ) : ownerBookings.length === 0 ? (
            <p className="text-gray-400">No bookings yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {ownerBookings.map((b) => (
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
                        <img src={b.paymentScreenshot.startsWith('data:') ? b.paymentScreenshot : `data:image/png;base64,${b.paymentScreenshot}`} alt="proof" className="w-32 h-32 object-cover rounded-md border" />
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
                              // update local state
                              setOwnerBookings(prev => prev.map(p => p.id === b.id ? { ...p, paid: true, status: 'confirmed' } : p));
                              toast({ title: 'Booking confirmed' });
                            } catch (e) { console.error(e); toast({ title: 'Failed to confirm', description: e.message || 'Error', variant: 'destructive' }); }
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
                              toast({ title: 'Booking rejected' });
                            } catch (e) { console.error(e); toast({ title: 'Failed to reject', description: e.message || 'Error', variant: 'destructive' }); }
                          }} className="bg-red-600">Reject</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My PGs Section */}
        <section id="mypg">
          <h2 className="text-3xl font-bold mb-6">🏠 My PGs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPGs.map((pg, index) => (
              <Card key={index} className="glass-card hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-xl">{pg.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">📍 {pg.location}</p>
                  <p className="text-lg font-bold text-blue-400 mb-2">{pg.price}/month</p>
                  <p className="text-sm mb-2">🏠 Room: {pg.roomType || "N/A"}</p>
                  <p className="text-sm mb-4">📑 {pg.bookings} Bookings</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleEditPG(index)}>Edit</Button>
                    <Button variant="destructive" className="flex-1" onClick={() => handleDeletePG(index)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Edit Modal */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit PG Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input value={pgName} onChange={(e) => setPgName(e.target.value)} placeholder="PG Name" />
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
              <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
              <Textarea
                value={facilities}
                onChange={(e) => setFacilities(e.target.value)}
                placeholder="Facilities"
              />
              <Button onClick={handleUpdatePG} className="w-full bg-blue-500 hover:bg-blue-600">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default OwnerDashboard;
