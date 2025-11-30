import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listingId") || "1"; // Default to listing 1 if not provided

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch("/api/reviews/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          listingId: Number(listingId),
          rating: rating,
          comment: comment,
          guestName: name,
          guestEmail: email
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setRating(0);
        setName("");
        setEmail("");
        setComment("");
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to submit feedback");
      }
    } catch (err) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white">⭐ Feedback Page</h1>
        <p className="text-gray-300 mt-2">We'd love to hear your thoughts!</p>
        <Link to="/" className="text-blue-400 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-xl w-full">
        {/* Glass Card */}
        <div className="rounded-2xl shadow-2xl p-6 bg-white/20 backdrop-blur-md border border-white/30">
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">
            Give Your Feedback
          </h2>

          {/* Star Rating */}
          <div className="flex gap-3 mb-6 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-4xl cursor-pointer transition-colors ${star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-400"
                  }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </span>
            ))}
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/70 text-gray-900 placeholder:font-semibold placeholder:text-gray-700"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/70 text-gray-900 placeholder:font-semibold placeholder:text-gray-700"
              required
            />
            <Textarea
              placeholder="Write your feedback..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white/70 text-gray-900 placeholder:font-semibold placeholder:text-gray-700"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 font-semibold text-center mt-4">
              ❌ {error}
            </p>
          )}

          {/* Success Message */}
          {submitted && (
            <p className="text-green-400 font-semibold text-center mt-4">
              ✅ Thank you for your feedback! It has been saved to the database.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
