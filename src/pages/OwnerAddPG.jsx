import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const OwnerAddPG = () => {
  const [pgName, setPgName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [upiId, setUpiId] = useState("");
  const [roomType, setRoomType] = useState("");
  const [facilities, setFacilities] = useState("");

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
      toast.success('✅ PG Added Successfully!');
      setPgName(''); setLocation(''); setPrice(''); setRoomType(''); setFacilities(''); setUpiId('');
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to add PG');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      <DashboardSidebar type="owner" />
      <main className="flex-1 p-10 z-10">
        <section className="glass-card rounded-2xl p-6 shadow-lg max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">➕ Add New PG</h2>
          <form className="space-y-4" onSubmit={handleAddPG}>
            <Input type="text" placeholder="PG/Hostel Name" value={pgName} onChange={(e)=>setPgName(e.target.value)} required />
            <Input type="text" placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} required />
            <Input type="text" placeholder="Price per Month" value={price} onChange={(e)=>setPrice(e.target.value)} required />
            <Input type="text" placeholder="Owner UPI ID (e.g. owner@upi)" value={upiId} onChange={(e)=>setUpiId(e.target.value)} />
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
            <Textarea placeholder="Facilities (WiFi, Food, AC...)" value={facilities} onChange={(e)=>setFacilities(e.target.value)} />
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">Add PG</Button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default OwnerAddPG;
