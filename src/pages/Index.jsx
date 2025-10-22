import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <section className="flex flex-1 flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-4">
          Welcome to <span className="text-accent">FindMyStay</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-foreground/90">
          Your one-stop solution to find comfortable, affordable, and secure PGs & hostels with transparent fee management.
        </p>

        <div className="flex gap-6">
          <Button
            onClick={() => navigate("/user-login")}
            size="lg"
            className="px-6 py-6 rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg shadow-lg"
          >
            👤 Continue as User
          </Button>
          <Button
            onClick={() => navigate("/owner-login")}
            size="lg"
            variant="secondary"
            className="px-6 py-6 rounded-2xl font-semibold text-lg shadow-lg"
          >
            🏢 Continue as Owner
          </Button>
        </div>
      </section>

      <footer className="text-center py-4 glass-sidebar text-sm">
        © 2025 FindMyStay
      </footer>
    </div>
  );
};

export default Index;
