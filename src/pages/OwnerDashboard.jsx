import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const OwnerDashboard = () => {
  const myPGs = [
    { name: "Sunrise PG", location: "Sector 5", price: "₹5000", bookings: 12 },
    { name: "Moonlight Hostel", location: "Downtown", price: "₹4000", bookings: 8 },
  ];

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar type="owner" />

      <main className="flex-1 p-10 z-10 space-y-10">
        <section id="addpg" className="glass-card rounded-2xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">➕ Add New PG</h2>
          <form className="space-y-4">
            <Input type="text" placeholder="PG/Hostel Name" required />
            <Input type="text" placeholder="Location" required />
            <Input type="number" placeholder="Price per Month" required />
            
            <Select required>
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

            <Textarea placeholder="Facilities (WiFi, Food, AC...)" />
            
            <div>
              <label className="block text-sm mb-2">Upload Image</label>
              <Input type="file" accept="image/*" />
            </div>

            <Button type="submit" className="w-full">Add PG</Button>
          </form>
        </section>

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
                  <p className="text-lg font-bold text-accent mb-2">{pg.price}/month</p>
                  <p className="text-sm mb-4">📑 {pg.bookings} Bookings</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Edit</Button>
                    <Button variant="destructive" className="flex-1">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="bookings" className="glass-card rounded-2xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">📑 Recent Bookings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-muted-foreground">Sunrise PG - Single Room</p>
              </div>
              <p className="text-accent font-bold">₹5000</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
              <div>
                <p className="font-semibold">Jane Smith</p>
                <p className="text-sm text-muted-foreground">Moonlight Hostel - Double Room</p>
              </div>
              <p className="text-accent font-bold">₹4000</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OwnerDashboard;
