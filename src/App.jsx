import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import Signup from "./pages/Signup.jsx";
import UserLogin from "./pages/UserLogin";
import OwnerLogin from "./pages/OwnerLogin";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from "./pages/UserProfile";
import OwnerProfile from "./pages/OwnerProfile";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import OwnerAddPG from "./pages/OwnerAddPG";
import OwnerMyPGs from "./pages/OwnerMyPGs";
import OwnerBookings from "./pages/OwnerBookings";

// 🆕 Booking-related pages
import UserBooking from "./pages/UserBooking";
import BookingDetails from "./pages/BookingDetails"; // 👈 You'll create this next

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 🌐 General Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/signup" element={<Signup />} />

          {/* 👤 Login Pages */}
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/owner-login" element={<OwnerLogin />} />

          {/* 🧭 Dashboard Pages (protected) */}
          <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          {/* owner-dashboard removed - owners land on /owner/bookings */}
          <Route path="/owner/add-pg" element={<ProtectedRoute role="owner"><OwnerAddPG /></ProtectedRoute>} />
          <Route path="/owner/my-pgs" element={<ProtectedRoute role="owner"><OwnerMyPGs /></ProtectedRoute>} />
          <Route path="/owner/bookings" element={<ProtectedRoute role="owner"><OwnerBookings /></ProtectedRoute>} />

          {/* 🧑‍💼 Profile Pages */}
          <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/owner/profile" element={<ProtectedRoute role="owner"><OwnerProfile /></ProtectedRoute>} />

          {/* 💳 Payment Page */}
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />

          {/* 🧾 User Bookings */}
          <Route path="/user/bookings" element={<ProtectedRoute><UserBooking /></ProtectedRoute>} />
          <Route path="/user/bookings/:bookingId" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />

          {/* ❌ Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
