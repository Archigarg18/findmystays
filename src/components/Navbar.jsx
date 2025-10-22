import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 glass-sidebar shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-wide hover:text-accent transition">
        🏠 FindMyStay
      </Link>
      <div className="space-x-6 text-lg font-medium">
        <Link to="/" className="hover:text-accent transition">Home</Link>
        <Link to="/about" className="hover:text-accent transition">About</Link>
        <Link to="/signup" className="hover:text-accent transition">Sign Up</Link>
        <Link to="/contact" className="hover:text-accent transition">Contact</Link>
        <Link to="/feedback" className="hover:text-accent transition">Feedback</Link>
      </div>
    </nav>
  );
};

export default Navbar;
