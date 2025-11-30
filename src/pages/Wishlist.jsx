import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from '@/contexts/AuthContext';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const { apiFetch } = await import('@/lib/api');
                const res = await apiFetch('/api/wishlist', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setWishlist(data);
                }
            } catch (error) {
                console.error("Failed to fetch wishlist", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [user]);

    const removeFromWishlist = async (listingId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { apiFetch } = await import('@/lib/api');
            const res = await apiFetch(`/api/wishlist/${listingId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setWishlist(prev => prev.filter(item => item.listingId !== listingId));
            }
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
        }
    };

    const handleBookNow = (pg) => navigate('/payment', { state: { pg } });

    return (
        <div className="min-h-screen flex bg-[#0f172a] text-white">
            <DashboardSidebar type="user" />

            <main className="flex-1 p-10">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight">My Wishlist ❤️</h1>
                </div>

                {loading ? (
                    <p>Loading wishlist...</p>
                ) : wishlist.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="text-gray-400 text-xl mb-4">Your wishlist is empty 💔</p>
                        <Button onClick={() => navigate('/user-dashboard')} className="bg-blue-600 hover:bg-blue-700">
                            Browse PGs
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                <Card className="bg-white/15 backdrop-blur-lg rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform border border-white/10">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-white">{item.listing.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm mb-2">📍 {item.listing.location}</p>
                                        <p className="text-lg font-bold text-blue-300 mb-2">₹{item.listing.price}/month</p>
                                        <p className="text-sm mb-2">🛏 {item.listing.type}</p>
                                        <p className="text-sm text-gray-200 mb-4">{item.listing.facilities}</p>

                                        <div className="flex gap-2">
                                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleBookNow(item.listing)}>
                                                Book Now
                                            </Button>
                                            <Button variant="destructive" className="px-3" onClick={() => removeFromWishlist(item.listingId)}>
                                                🗑️
                                            </Button>
                                        </div>
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

export default Wishlist;
