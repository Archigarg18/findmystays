import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center font-sans px-4 bg-transparent">
      <div className="glass-card rounded-2xl shadow-xl p-8 max-w-lg w-full text-center bg-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-2 text-white">📞 Contact Us</h1>
        <p className="text-gray-200 mb-6">
          We'd love to hear from you! Reach us via:
        </p>

        <ul className="space-y-3 text-gray-100 text-left">
          <li><strong>📞 Phone:</strong> +91 98765 43210</li>
          <li><strong>📧 Email:</strong> support@pgfinder.com</li>
          <li><strong>📍 Address:</strong> Chitkara University, Rajpura, Punjab</li>
        </ul>

        <div className="mt-6">
          <iframe 
            className="w-full h-56 rounded-lg shadow-md"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3481.873!2d76.659210!3d30.516459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDMxJzU1LjEiTiA3NsKwMzknMzAuMiJF!5e0!3m2!1sen!2sin!4v1692470000000!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
            title="Chitkara University Location"
          />
        </div>

        <Link 
          to="/" 
          className="mt-6 inline-block px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Contact;
