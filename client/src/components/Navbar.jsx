import { useState } from "react";
import { Menu, X, Calendar as CalendarIcon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[#1e2f40] shadow-md py-4 px-6 md:px-8 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
            <CalendarIcon className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            Appointment System
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-slate-300 font-medium">
          <a href="/login" className="hover:text-white transition-colors">
            Login
          </a>
          <a href="/register" className="hover:text-white transition-colors">
            Register
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0  w-80 max-w-[40vw] bg-[#1e2f40] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                <CalendarIcon className="text-white" size={20} />
              </div>
              <span className="font-bold text-white tracking-wide">Menu</span>
            </div>
            <button
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4">
            <a
              href="/login"
              className="block text-slate-300 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Login
            </a>
            <a
              href="/register"
              className="block text-slate-300 hover:text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
