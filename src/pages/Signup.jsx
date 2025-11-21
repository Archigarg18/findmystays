import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, phone, gender, city }),
      });
      const text = await res.text();
      let data = null;
      if (text) {
        try { data = JSON.parse(text); } catch (err) { throw new Error(`Invalid server response: ${text}`); }
      }
      if (!res.ok) throw new Error(data?.error || data?.message || `Signup failed (${res.status})`);
      // expect { token, user }
      if (data?.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('token', data.token);
      }
  if (role === 'owner') navigate('/owner/bookings');
  else navigate('/user-dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* Glass effect card */}
      <div className="p-8 rounded-2xl shadow-2xl w-full max-w-md bg-white/20 backdrop-blur-md border border-white/30">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          📝 Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-100">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Enter your name"
              className="bg-white/70 text-gray-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-100">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/70 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-100">Phone</label>
            <Input type="text" placeholder="Phone number" className="bg-white/70 text-gray-900" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-100">City</label>
            <Input type="text" placeholder="City" className="bg-white/70 text-gray-900" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-100">Gender</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="bg-white/70 text-gray-900">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-100">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="bg-white/70 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-100">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Re-enter your password"
              className="bg-white/70 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-100">
              Sign up as:
            </label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger className="bg-white/70 text-gray-900">
                <SelectValue placeholder="-- Select Role --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-300">
          Already have an account?{" "}
          <Link
            to="/user-login"
            className="text-blue-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

