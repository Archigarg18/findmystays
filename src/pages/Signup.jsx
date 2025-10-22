import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === "user") {
      navigate("/user-dashboard");
    } else if (role === "owner") {
      navigate("/owner-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">📝 Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Full Name</label>
            <Input type="text" placeholder="Enter your name" required />
          </div>

          <div>
            <label className="block text-sm mb-2">Email</label>
            <Input type="email" placeholder="Enter your email" required />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <Input type="password" placeholder="Enter your password" required />
          </div>

          <div>
            <label className="block text-sm mb-2">Confirm Password</label>
            <Input type="password" placeholder="Re-enter your password" required />
          </div>

          <div>
            <label className="block text-sm mb-2">Sign up as:</label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="-- Select Role --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
            Create Account
          </Button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/user-login" className="text-accent hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
