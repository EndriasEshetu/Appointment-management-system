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
          <a
            href="/register"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#1e2f40] border-t border-white/10 p-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
          <a
            href="/login"
            className="block text-slate-300 hover:text-white text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Login
          </a>
          <a
            href="/register"
            className="block text-white bg-blue-600 px-4 py-3 rounded-xl text-center font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Register
          </a>
        </div>
      )}
    </nav>
  );
}

