import { NavLink, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const navItems = [
  { to: "/admin/dashboard", label: "Appointments", icon: "📅" },
  { to: "/admin/availability", label: "Availability", icon: "🕐" },
];

const AdminLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-[#475a6c] font-sans">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-64 bg-[#1f2937] shadow-xl flex flex-col border-r border-gray-800">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white tracking-wide">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#10b981]/20 text-[#10b981]"
                    : "text-gray-300 hover:bg-[#374151] hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 bg-red-900/20 rounded-lg hover:bg-red-900/40 border border-transparent hover:border-red-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────── */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
