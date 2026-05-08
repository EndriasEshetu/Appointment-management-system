import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AvailabilityManager from "./pages/AvailabilityManager";
import CustomerLayout from "./components/CustomerLayout";
import BookingCalendar from "./pages/BookingCalendar";
import MyAppointments from "./pages/MyAppointments";

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              user && user.role === "admin" ? (
                <AdminLayout />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="availability" element={<AvailabilityManager />} />
          </Route>

          <Route
            path="/customer"
            element={
              user && user.role === "customer" ? (
                <CustomerLayout />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route index element={<Navigate to="book" replace />} />
            <Route path="book" element={<BookingCalendar />} />
            <Route path="my-appointments" element={<MyAppointments />} />
          </Route>

          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : (
                  <Navigate to="/customer/book" />
                )
              ) : (
                <Homepage />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
