import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UserLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/user-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">👤 User Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <Input type="email" placeholder="Enter your email" required />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <Input type="password" placeholder="Enter your password" required />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Login
          </Button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
