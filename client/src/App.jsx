import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AvailabilityManager from "./pages/AvailabilityManager";

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* ── Public routes ──────────────────────── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Admin routes (nested under AdminLayout) ─ */}
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

          {/* ── Root redirect ─────────────────────── */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-3xl font-bold text-gray-800">
                      Welcome, {user.name}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                      You are logged in as:{" "}
                      <span className="font-semibold text-blue-600">
                        {user.role}
                      </span>
                    </p>
                    <button
                      onClick={() => useAuthStore.getState().logout()}
                      className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ── Catch-all ─────────────────────────── */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

