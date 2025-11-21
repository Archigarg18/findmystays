import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const OwnerMyPGs = () => {
  const [myPGs, setMyPGs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPG, setEditingPG] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { apiFetch } = await import('@/lib/api');
        const res = await apiFetch('/api/listings');
        const txt = await res.text();
        let d = [];
        if (txt) { try { d = JSON.parse(txt); } catch (e) { console.error('Invalid listings response', txt); } }
        const ownerId = user?.id;
        const mine = Array.isArray(d) ? d.filter(l => l.ownerId === ownerId) : [];
        setMyPGs(mine);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [user]);

  const handleOpenEditModal = (pg) => {
    setEditingPG(pg);
    setEditFormData({
      name: pg.name || '',
      description: pg.description || '',
      location: pg.location || '',
      price: pg.price || '',
      upiId: pg.upiId || '',
      type: pg.type || '',
      facilities: pg.facilities || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPG) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      // Coerce numeric fields to proper types before sending
      const payload = {
        ...editFormData,
        price: editFormData.price === '' || editFormData.price === null || editFormData.price === undefined
          ? null
          : Number(editFormData.price)
      };

      const res = await apiFetch(`/api/listings/${editingPG.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      let data = null;
      if (text) { try { data = JSON.parse(text); } catch (e) { console.error('Invalid response', text); } }
      if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`);
      
      // Update local state
      setMyPGs(prev => prev.map(p => p.id === editingPG.id ? data : p));
      setEditingPG(null);
      toast.success('PG updated successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update: ' + (e.message || e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePG = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PG?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const text = await res.text();
      let data = null;
      if (text) { try { data = JSON.parse(text); } catch (e) { console.error('Invalid response', text); } }
      if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`);
      
      setMyPGs(prev => prev.filter(p => p.id !== id));
      toast.success('PG deleted successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete: ' + (e.message || e));
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      <DashboardSidebar type="owner" />
      <main className="flex-1 p-10 z-10">
        <h2 className="text-3xl font-bold mb-6">🏠 My PGs</h2>
        {loading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPGs.map((pg, idx) => (
              <Card key={pg.id || idx} className="glass-card hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="text-xl">{pg.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">📍 {pg.location}</p>
                  <p className="text-lg font-bold text-blue-400 mb-2">{pg.price}/month</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleOpenEditModal(pg)}>Edit</Button>
                    <Button variant="destructive" className="flex-1" onClick={() => handleDeletePG(pg.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      <Dialog open={!!editingPG} onOpenChange={() => setEditingPG(null)}>
        <DialogContent className="bg-[#0f172a] text-white border border-white/10 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit PG</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pr-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <Input
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="PG Name"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <Textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Location</label>
              <Input
                value={editFormData.location}
                onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Location"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Price (₹/month)</label>
              <Input
                type="number"
                value={editFormData.price}
                onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Price"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">UPI ID</label>
              <Input
                value={editFormData.upiId}
                onChange={(e) => setEditFormData(prev => ({ ...prev, upiId: e.target.value }))}
                placeholder="UPI ID (e.g., user@upi)"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Type</label>
              <Input
                value={editFormData.type}
                onChange={(e) => setEditFormData(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Room Type (e.g., Single, Double, Sharing)"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Facilities</label>
              <Textarea
                value={editFormData.facilities}
                onChange={(e) => setEditFormData(prev => ({ ...prev, facilities: e.target.value }))}
                placeholder="Facilities (e.g., WiFi, AC, etc.)"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="sticky bottom-0 bg-[#0f172a] flex gap-2 justify-end pt-4 border-t border-white/10">
              <Button variant="outline" onClick={() => setEditingPG(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit} disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OwnerMyPGs;
