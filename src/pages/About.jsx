import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-4">ℹ️ About Us</h2>
        <p className="text-lg mb-6 text-foreground/90 leading-relaxed">
          Welcome to <span className="text-accent font-semibold">FindMyStay</span>, your trusted partner in finding 
          the perfect PG or hostel. Our mission is to connect students and professionals with comfortable, 
          affordable, and safe accommodations across the city.  
        </p>
        <p className="text-lg mb-6 text-foreground/90 leading-relaxed">
          Whether you're looking for single, double, or shared rooms, we make the process simple and transparent. 
          With verified listings, easy filters, and secure booking, finding your stay has never been easier.  
        </p>
        <p className="text-lg text-foreground/90 leading-relaxed">
          We believe that your stay should feel like home. That's why we work hard to ensure every PG we list 
          offers quality, safety, and comfort. 🌟
        </p>

        <Link 
          to="/" 
          className="mt-6 inline-block px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition"
        >
          ⬅️ Back to Home
        </Link>
      </div>
    </div>
  );
};

export default About;
