import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">⭐ Feedback Page</h1>
        <p className="text-muted-foreground mt-2">We'd love to hear your thoughts!</p>
        <Link to="/" className="text-primary hover:underline text-sm">← Back to Home</Link>
      </div>

      <div className="max-w-xl w-full">
        <div className="glass-card rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center">Give Your Feedback</h2>
          
          <div className="flex gap-3 mb-6 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-4xl cursor-pointer transition-colors ${
                  star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-600"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </span>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              className="w-full"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              className="w-full"
              required
            />
            <Textarea
              placeholder="Write your feedback..."
              rows={4}
              className="w-full"
              required
            />
            <Button type="submit" className="w-full">
              Submit Feedback
            </Button>
          </form>

          {submitted && (
            <p className="text-green-400 font-semibold text-center mt-4">
              ✅ Thank you for your feedback!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
