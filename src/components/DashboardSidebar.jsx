import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';

const DashboardSidebar = ({ type }) => {
  const userLinks = [
    { href: "/user-dashboard", icon: "📊", label: "Dashboard" },
    { href: "/user/profile", icon: "👤", label: "Profile" },
    { href: "/user/bookings", icon: "📦", label: "My Bookings" }, // ✅ updated route
  ];

  const ownerLinks = [
    { href: "/owner/add-pg", icon: "➕", label: "Add PG" },
    { href: "/owner/my-pgs", icon: "🏠", label: "My PGs" },
    { href: "/owner/bookings", icon: "📑", label: "Bookings" },
    { href: "/owner/profile", icon: "👤", label: "Profile" },
  ];

  const links = type === "user" ? userLinks : ownerLinks;

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 glass-sidebar p-6 flex flex-col justify-between z-10">
      <div>
        <h2 className="text-2xl font-bold mb-10">
          {type === "user" ? "🏠 FindMyStay" : "🏢 Owner Panel"}
        </h2>
        <nav className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block px-4 py-2 rounded-lg hover:bg-sidebar-accent transition"
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-6 rounded-lg bg-destructive hover:opacity-90 transition text-center text-white"
      >
        🚪 Logout
      </button>
    </aside>
  );
};

export default DashboardSidebar;
