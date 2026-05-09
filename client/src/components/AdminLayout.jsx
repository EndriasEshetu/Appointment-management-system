import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { Menu, X, Calendar, Clock, LogOut } from "lucide-react";

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Appointments",
    icon: <Calendar size={20} />,
  },
  {
    to: "/admin/availability",
    label: "Availability",
    icon: <Clock size={20} />,
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#475a6c] font-sans relative">
      {/* ── Mobile Overlay ───────────────────────── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────── */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-[#1f2937] shadow-2xl flex flex-col border-r border-gray-800 z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Admin Panel
            </h1>
            <p className="text-xs text-gray-400 mt-1 truncate max-w-45">
              {user?.email}
            </p>
          </div>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-400 bg-red-900/10 rounded-xl hover:bg-red-900/20 border border-red-900/20 hover:border-red-800/40 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#1f2937] p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-white">Admin Panel</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#475a6c]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
