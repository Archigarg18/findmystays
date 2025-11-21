import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#0a0f1c] shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide text-white flex items-center space-x-2 hover:text-blue-400 transition"
        >
          <span role="img" aria-label="home">🏠</span>
          <span>FindMyStay</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-8 text-white text-lg font-medium">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          <Link to="/about" className="hover:text-blue-400 transition">About</Link>
          <Link to="/signup" className="hover:text-blue-400 transition">Sign Up</Link>
          <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
          <Link to="/feedback" className="hover:text-blue-400 transition">Feedback</Link>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-[#0a0f1c] px-6 pb-6 flex flex-col space-y-4 text-white text-lg">
          <Link onClick={() => setOpen(false)} to="/" className="hover:text-blue-400">Home</Link>
          <Link onClick={() => setOpen(false)} to="/about" className="hover:text-blue-400">About</Link>
          <Link onClick={() => setOpen(false)} to="/signup" className="hover:text-blue-400">Sign Up</Link>
          <Link onClick={() => setOpen(false)} to="/contact" className="hover:text-blue-400">Contact</Link>
          <Link onClick={() => setOpen(false)} to="/feedback" className="hover:text-blue-400">Feedback</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

