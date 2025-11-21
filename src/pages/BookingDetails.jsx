import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const BookingDetails = ({ pg, onPay, onCancel }) => {
  const [isCancelled, setIsCancelled] = useState(false);
  const { user: currentUser } = useAuth();

  const handleCancel = () => {
    if (onCancel) {
      onCancel(pg);
    } else {
      // fallback UX: mark cancelled locally
      setIsCancelled(true);
      alert(`❌ Booking for ${pg.name} cancelled locally.`);
    }
  };

  if (isCancelled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
        <p className="text-xl text-red-400 mb-4">This booking has been cancelled.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
      <div className="bg-white/15 backdrop-blur-lg p-10 rounded-2xl shadow-lg border border-white/10 w-[400px] text-center">
        <h2 className="text-3xl font-bold mb-4">📋 Booking Details</h2>
        <h3 className="text-xl font-semibold mb-2">{pg.name}</h3>
        <p>📍 {pg.location}</p>
        <p>🛏 {pg.type}</p>
        <p className="font-semibold text-blue-300">₹{pg.price}/month</p>
        <p className="mt-2 text-sm text-gray-300">{pg.facilities}</p>

        <div className="mt-6 flex gap-4">
          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={onPay}>
            Proceed to Payment
          </Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleCancel}>
            Cancel Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;