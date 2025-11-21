import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import FormattedLabel from '@/components/FormattedLabel';
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner"; // ✅ Import toast from sonner

const OwnerProfile = () => {
  const [ownerData, setOwnerData] = useState({});
  const [editing, setEditing] = useState(false);

  // Load saved owner data
  const { user } = useAuth();
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { apiFetch } = await import('@/lib/api');
        const res = await apiFetch('/api/users/me', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        const txt = await res.text();
        let d = {};
        if (txt) { try { d = JSON.parse(txt); } catch (e) { console.error('Invalid profile response', txt); } }
        if (res.ok) setOwnerData(d);
        else if (user) setOwnerData(user);
      } catch (e) {
        if (user) setOwnerData(user);
      }
    })();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setOwnerData({ ...ownerData, [e.target.name]: e.target.value });
  };

  // Save updated data
  const handleSave = () => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { apiFetch } = await import('@/lib/api');
        const res = await apiFetch('/api/users/me', {
          method: 'PATCH',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ name: ownerData.name, phone: ownerData.contact || ownerData.phone, gender: ownerData.gender, city: ownerData.city }),
        });
        const txt = await res.text();
        let d = {};
        if (txt) { try { d = JSON.parse(txt); } catch (e) { console.error('Invalid response', txt); } }
        if (!res.ok) throw new Error(d?.error || d?.message || 'Failed to save');
        setOwnerData(d);
        localStorage.setItem("ownerData", JSON.stringify(d));
        setEditing(false);
        toast.success("Profile updated successfully! 🎉", { duration: 3000 });
      } catch (e) {
        console.error(e);
        toast.error('Failed to save profile');
      }
    })();
  };

  // Reset changes
  const handleReset = () => {
    const savedData = localStorage.getItem("ownerData");
    if (savedData) setOwnerData(JSON.parse(savedData));
    setEditing(false);
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      {/* Sidebar same as OwnerDashboard */}
      <DashboardSidebar type="owner" />

      {/* Main Content */}
      <main className="flex-1 p-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl shadow-lg max-w-3xl mx-auto border border-slate-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-400 text-center">
            👤 Owner Profile
          </h2>

          <div className="space-y-5">
            {["name", "email", "phone", "city", "address"].map((field) => (
              <div key={field}>
                <label className="block text-sm mb-2 text-gray-300">
                  {field === 'phone' ? 'Contact' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>

                {editing ? (
                  <Input
                    type="text"
                    name={field}
                    value={ownerData[field] || ""}
                    onChange={handleChange}
                    className="bg-slate-900 border-slate-700 text-white placeholder-gray-400"
                    readOnly={field === 'email'}
                  />
                ) : (
                  <p className="bg-slate-900 border border-slate-700 p-3 rounded-md">
                    <FormattedLabel value={ownerData[field]} />
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            {editing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-gray-400 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default OwnerProfile;
