import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import FormattedLabel from '@/components/FormattedLabel';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    bookings: [],
  });

  const { user } = useAuth();

  // Load user info from API; fallback to auth user
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { apiFetch } = await import('@/lib/api');
        const res = await apiFetch('/api/users/me', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        const txt = await res.text();
        let d = {};
        if (txt) { try { d = JSON.parse(txt); } catch (e) { console.error('Invalid profile response', txt); } }
        if (res.ok) setProfile(d);
        else if (user) setProfile(user);
      } catch (e) {
        if (user) setProfile(user);
      }
    })();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);

    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { apiFetch } = await import('@/lib/api');
        const res = await apiFetch('/api/users/me', {
          method: 'PATCH',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ name: profile.name, phone: profile.phone, gender: profile.gender, city: profile.city }),
        });
        const txt = await res.text();
        let d = {};
        if (txt) { try { d = JSON.parse(txt); } catch (e) { console.error('Invalid response', txt); } }
        if (!res.ok) throw new Error(d?.error || d?.message || 'Failed to save');
        setProfile(d);
        localStorage.setItem('currentUser', JSON.stringify(d));
        toast.success("Profile Updated! 🎉");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      } catch (e) {
        console.error(e);
        toast.error('Failed to update profile');
      }
    })();
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      {/* Sidebar */}
      <DashboardSidebar type="user" />

      {/* Main Content */}
      <main className="flex-1 p-10 z-10">
        <h1 className="text-4xl font-extrabold mb-6">
          👤 <span className="text-blue-400">User Profile</span>
        </h1>

        {/* Profile Card */}
        <Card className="glass-card max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {["name", "email", "phone", "gender", "city"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <Input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={profile[field]}
                      onChange={handleChange}
                      required
                      readOnly={field === 'email'}
                    />
                  </div>
                ))}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </form>
            ) : (
              <>
                {["name", "email", "phone", "gender", "city"].map((field) => (
                  <div key={field} className="flex justify-between text-gray-300">
                    <span className="font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                    <FormattedLabel value={profile[field]} />
                  </div>
                ))}
                <div className="flex justify-center mt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="glass-card p-8 rounded-2xl shadow-2xl text-center animate-in fade-in zoom-in duration-300">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-2">Profile Updated!</h2>
              <p className="text-gray-300">Your profile information has been saved.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;