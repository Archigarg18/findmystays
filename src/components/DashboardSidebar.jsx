import { Link } from "react-router-dom";

const DashboardSidebar = ({ type }) => {
  const userLinks = [
    { href: "/user-dashboard", icon: "📊", label: "Dashboard" },
    { href: "#", icon: "👤", label: "Profile" },
    { href: "#", icon: "📦", label: "My Bookings" },
    { href: "/payment", icon: "💳", label: "Payments" },
  ];

  const ownerLinks = [
    { href: "/owner-dashboard", icon: "📊", label: "Dashboard" },
    { href: "#addpg", icon: "➕", label: "Add PG" },
    { href: "#mypg", icon: "🏠", label: "My PGs" },
    { href: "#bookings", icon: "📑", label: "Bookings" },
  ];

  const links = type === "user" ? userLinks : ownerLinks;

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
      <Link
        to="/"
        className="px-4 py-2 mt-6 rounded-lg bg-destructive hover:opacity-90 transition text-center"
      >
        🚪 Logout
      </Link>
    </aside>
  );
};

export default DashboardSidebar;
