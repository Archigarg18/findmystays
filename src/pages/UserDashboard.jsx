import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const UserDashboard = () => {
  const pgListings = [
    {
      name: "Cozy Stay PG",
      location: "Near College",
      price: "₹4500/month",
      type: "Double",
      facilities: "WiFi, Food, AC",
    },
    {
      name: "Comfort Inn",
      location: "City Center",
      price: "₹6000/month",
      type: "Single",
      facilities: "WiFi, Gym, Parking",
    },
    {
      name: "Budget Hostel",
      location: "Near Metro",
      price: "₹3000/month",
      type: "Triple",
      facilities: "WiFi, Food",
    },
  ];

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar type="user" />

      <main className="flex-1 p-10 z-10">
        <h1 className="text-4xl font-extrabold drop-shadow mb-6">
          Welcome Back, <span className="text-accent">User</span> 👋
        </h1>

        <div className="glass-card rounded-2xl p-6 shadow-lg mb-10">
          <h2 className="text-2xl font-bold mb-4">🔍 Filter PGs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">💰 Price Range</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
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
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college">Near College</SelectItem>
                  <SelectItem value="metro">Near Metro</SelectItem>
                  <SelectItem value="center">City Center</SelectItem>
                  <SelectItem value="outskirts">Outskirts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">🛏️ Room Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
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

        <h2 className="text-3xl font-bold mb-6">🏠 Available PGs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pgListings.map((pg, index) => (
            <Card key={index} className="glass-card hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="text-xl">{pg.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">📍 {pg.location}</p>
                <p className="text-lg font-bold text-accent mb-2">{pg.price}</p>
                <p className="text-sm mb-2">🛏️ {pg.type}</p>
                <p className="text-sm text-muted-foreground mb-4">{pg.facilities}</p>
                <Button className="w-full">Book Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
