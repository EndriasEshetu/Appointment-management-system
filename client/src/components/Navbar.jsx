export default function Navbar() {
  return (
    <nav className="w-full bg-[#1e2f40] shadow-md py-4 px-8 flex">
      <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
            <span className="text-white text-xl font-bold">📅</span>
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            Appointment System
          </span>
        </div>
        <div className="flex gap-6 text-slate-300 font-medium">
          <a href="/login" className="hover:text-white transition">
            Login
          </a>
          <a href="/register" className="hover:text-white transition">
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}
