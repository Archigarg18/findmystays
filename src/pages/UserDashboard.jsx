import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookedListingIds, setBookedListingIds] = useState(new Set());

  const { user } = useAuth();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
  const { apiFetch } = await import('@/lib/api');
  const res = await apiFetch('/api/listings');
  const text = await res.text();
        let data = [];
        if (text) {
          try { data = JSON.parse(text); } catch (e) { console.error('Invalid listings response', text); }
        }
        setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    };
    fetchListings();
  }, []);

  // Fetch current user's bookings to mark booked PGs
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setBookedListingIds(new Set());
        const { apiFetch } = await import('@/lib/api');
        const res = await apiFetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } });
        const txt = await res.text();
        let all = [];
        if (txt) { try { all = JSON.parse(txt); } catch (e) { console.error('Invalid bookings response', txt); } }
        if (!Array.isArray(all)) return setBookedListingIds(new Set());
        const ids = new Set(all.filter(b => b && b.listingId && b.status !== 'cancelled' && b.status !== 'rejected').map(b => b.listingId));
        setBookedListingIds(ids);
      } catch (e) {
        console.error('Failed to fetch bookings', e);
        setBookedListingIds(new Set());
      }
    })();
  }, [user]);

  const [priceRange, setPriceRange] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [roomType, setRoomType] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(null);

  const applyFilters = () => setAppliedFilters({ priceRange, location: locationFilter, roomType });
  const clearFilters = () => { setPriceRange(""); setLocationFilter(""); setRoomType(""); setAppliedFilters(null); };

  const filteredPGs = listings.filter((pg) => {
    if (!appliedFilters) return true;
    const { priceRange, location, roomType } = appliedFilters;
    const price = Number(pg.price || 0);
    const matchesPrice = priceRange === "" ||
      (priceRange === "below3000" && price < 3000) ||
      (priceRange === "3000-5000" && price >= 3000 && price <= 5000) ||
      (priceRange === "5000-8000" && price > 5000 && price <= 8000) ||
      (priceRange === "above8000" && price > 8000);
    const matchesLocation = location === "" || (location === "college" && pg.location === "Near College") || (location === "metro" && pg.location === "Near Metro") || (location === "center" && pg.location === "City Center") || (location === "outskirts" && pg.location === "Outskirts");
    const matchesType = roomType === "" || (pg.type || "").toLowerCase() === roomType;
    return matchesPrice && matchesLocation && matchesType;
  });

  const handleBookNow = (pg) => navigate('/payment', { state: { pg } });

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      <DashboardSidebar type="user" />

      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome Back, <span className="text-blue-400">User</span> 👋</h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-10 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">🔍 Filter PGs</h2>
            <div className="flex gap-3">
              <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700 text-white transition-all">Apply Filters</Button>
              <Button variant="outline" onClick={clearFilters} className="bg-gray-600 hover:bg-gray-700 text-white border-none">Clear</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">💰 Price Range</label>
              <Select onValueChange={setPriceRange} value={priceRange}>
                <SelectTrigger className="bg-white/10 text-white border border-white/20"><SelectValue placeholder="Select price range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="below3000">Below ₹3000</SelectItem>
                  <SelectItem value="3000-5000">₹3000 - ₹5000</SelectItem>
                  <SelectItem value="5000-8000">₹5000 - ₹8000</SelectItem>
                  <SelectItem value="above8000">Above ₹8000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">📍 Location</label>
              <Select onValueChange={setLocationFilter} value={locationFilter}>
                <SelectTrigger className="bg-white/10 text-white border border-white/20"><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="college">Near College</SelectItem>
                  <SelectItem value="metro">Near Metro</SelectItem>
                  <SelectItem value="center">City Center</SelectItem>
                  <SelectItem value="outskirts">Outskirts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">🛏 Room Type</label>
              <Select onValueChange={setRoomType} value={roomType}>
                <SelectTrigger className="bg-white/10 text-white border border-white/20"><SelectValue placeholder="Select room type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="triple">Triple</SelectItem>
                  <SelectItem value="quad">Quad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">🏠 Available PGs</h2>
          <p className="text-gray-300">{filteredPGs.length} result{filteredPGs.length !== 1 && "s"} found</p>
        </div>

        {loading ? (
          <p>Loading listings...</p>
        ) : filteredPGs.length === 0 ? (
          <p className="text-gray-400 text-center text-lg mt-10">No PGs match your filters 😔</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPGs.map((pg, index) => (
              <motion.div key={pg.id || index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card className="bg-white/15 backdrop-blur-lg rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{pg.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">📍 {pg.location}</p>
                    <p className="text-lg font-bold text-blue-300 mb-2">₹{pg.price}/month</p>
                    <p className="text-sm mb-2">🛏 {pg.type}</p>
                    <p className="text-sm text-gray-200 mb-4">{pg.facilities}</p>
                    {bookedListingIds.has(pg.id) ? (
                      <Button variant="outline" className="w-full" onClick={() => navigate('/user/bookings')}>Booked</Button>
                    ) : (
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleBookNow(pg)}>Book Now</Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;