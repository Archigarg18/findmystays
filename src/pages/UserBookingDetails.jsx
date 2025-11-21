import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';

const UserBookingDetails = () => {
  const { bookingName } = useParams(); // Using name as identifier
  const { user: currentUser } = useAuth();

  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const r = await apiFetch('/api/bookings', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        const t = await r.text();
        let all = [];
        if (t) { try { all = JSON.parse(t); } catch (e) { console.error('Invalid bookings response', t); } }
        const matchedBooking = Array.isArray(all) ? all.find((b) => b.name === bookingName) : null;
        setBooking(matchedBooking);
      } catch (e) { console.error(e); }
    })();
  }, [currentUser, bookingName]);

  if (!currentUser) return <p>Please login first.</p>;
  if (!booking) return <p className="text-white mt-10 text-center">Booking not found or cancelled.</p>;

  return (
    <div className="min-h-screen flex text-white font-sans relative">
      <div className="fixed top-0 left-0 w-full h-full bg-[#0f172a] -z-10" />

      <aside className="w-64 bg-black/40 backdrop-blur-lg p-6 flex flex-col justify-between z-10">
        <div>
          <h2 className="text-2xl font-bold mb-10">🏠 FindMyStay</h2>
          <nav className="space-y-4">
            <Link to="/user-dashboard" className="block px-4 py-2 rounded-lg hover:bg-white/20 transition">
              📊 Dashboard
            </Link>
            <Link to="/user/profile" className="block px-4 py-2 rounded-lg hover:bg-white/20 transition">
              👤 Profile
            </Link>
            <Link to="/user/bookings" className="block px-4 py-2 rounded-lg hover:bg-white/20 transition">
              📦 My Bookings
            </Link>
          </nav>
        </div>

        <Link
          to="/"
          className="px-4 py-2 mt-6 rounded-lg bg-red-500 hover:bg-red-600 transition text-center"
        >
          🚪 Logout
        </Link>
      </aside>

      <main className="flex-1 p-10 z-10">
        <h1 className="text-4xl font-extrabold mb-8">
          📄 Booking Details
        </h1>

        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{booking.name}</h2>
          <p className="text-sm mb-2">Room Type: {booking.type}</p>
          <p className="text-sm mb-2">Price: ₹{booking.price}/month</p>
          <p className="text-sm mb-2">Facilities: {booking.facilities}</p>
          <p className="text-sm text-green-300 mb-3">Status: ✅ Confirmed</p>

          <div className="flex flex-col gap-3">
            <Link
              to="/user/bookings"
              className="block text-center py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
            >
              🔙 Back to My Bookings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserBookingDetails;