import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Payment = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
    toast.success("Payment Successful! 🎉");
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar type="user" />

      <main className="flex-1 p-10 z-10">
        <h1 className="text-4xl font-extrabold drop-shadow mb-6">
          💳 Secure <span className="text-accent">Payment</span>
        </h1>

        <Card className="glass-card max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Card Holder Name</label>
                <Input type="text" placeholder="John Doe" required />
              </div>

              <div>
                <label className="block text-sm mb-2">Card Number</label>
                <Input type="text" placeholder="1234 5678 9012 3456" maxLength={19} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Expiry Date</label>
                  <Input type="text" placeholder="MM/YY" maxLength={5} required />
                </div>
                <div>
                  <label className="block text-sm mb-2">CVV</label>
                  <Input type="text" placeholder="123" maxLength={3} required />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Amount</label>
                <Input type="number" placeholder="5000" required />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Pay Now
              </Button>
            </form>
          </CardContent>
        </Card>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="glass-card p-8 rounded-2xl shadow-2xl text-center animate-in fade-in zoom-in duration-300">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground">Your payment has been processed.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payment;
