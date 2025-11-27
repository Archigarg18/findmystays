import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const OwnerLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(email, password);
      
  navigate('/owner/bookings');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <div className="bg-slate-800/60 p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-700 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">🏢 Owner Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-400">{error}</div>}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-lg">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;
