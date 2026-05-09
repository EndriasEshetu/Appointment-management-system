import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Calendar,
  Bell,
  Shield,
  LayoutDashboard,
  User,
  Settings,
  Clock,
  CheckCircle,
} from "lucide-react";

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#21486b]">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Appointment <br />
                Management Made Easy
              </h1>

              <p className="text-lg text-blue-100/80 mb-8 max-w-lg mx-auto lg:mx-0">
                Book, manage, and track your appointments in one place.
                <br />
                Save time. Stay organized. Never miss an appointment.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                <a
                  href="/login"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1"
                >
                  <User size={18} />
                  Login
                </a>

                <a
                  href="/register"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1"
                >
                  <CheckCircle size={18} />
                  Register
                </a>
              </div>

              {/* MINI FEATURES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <FeatureMiniCard
                  icon={<Calendar size={22} />}
                  title="Easy Booking"
                  desc="Book in just a few clicks."
                  color="bg-blue-500/20"
                />
                <FeatureMiniCard
                  icon={<Bell size={22} />}
                  title="Reminders"
                  desc="Timely reminders."
                  color="bg-green-500/20"
                />
                <FeatureMiniCard
                  icon={<Shield size={22} />}
                  title="Secure"
                  desc="Data is protected."
                  color="bg-purple-500/20"
                />
              </div>
            </div>

            {/* RIGHT MOCKUP */}
            <div className="bg-[#1f2937] backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl overflow-hidden hidden sm:block">
              <div className="grid grid-cols-[200px_1fr] md:grid-cols-[220px_1fr] min-h-[400px]">
                {/* Sidebar */}
                <div className="border-r border-white/10 p-4 bg-black/20">
                  <div className="w-8 h-8 rounded-full bg-blue-500 mb-6 mx-auto md:mx-0"></div>
                  <MockNavItem icon={<LayoutDashboard size={18} />} active>
                    Appointments
                  </MockNavItem>
                  <MockNavItem icon={<Calendar size={18} />}>
                    Availability
                  </MockNavItem>
                  <MockNavItem icon={<Clock size={18} />}>Calendar</MockNavItem>
                  <MockNavItem icon={<User size={18} />}>Profile</MockNavItem>
                  <MockNavItem icon={<Settings size={18} />}>
                    Settings
                  </MockNavItem>
                </div>

                {/* Dashboard content */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">
                      Appointments
                    </h3>
                    <span className="text-blue-400 text-xs cursor-pointer">
                      View all
                    </span>
                  </div>

                  <div className="space-y-3">
                    <AppointmentCard
                      name="Endrias Eshetu"
                      date="May 7, 2026"
                      time="9:00 AM"
                      status="Confirmed"
                      statusColor="bg-blue-500/20 text-blue-300"
                    />
                    <AppointmentCard
                      name="Jane Smith"
                      date="May 10, 2026"
                      time="11:30 AM"
                      status="Confirmed"
                      statusColor="bg-blue-500/20 text-blue-300"
                    />
                    <AppointmentCard
                      name="Alice Johnson"
                      date="Jun 1, 2026"
                      time="2:00 PM"
                      status="Pending"
                      statusColor="bg-yellow-500/20 text-yellow-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-[#14314f]/60 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-center text-blue-100/70 mb-12">
              Our platform helps you manage your schedule effortlessly.
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              <FeatureCard
                icon={<Calendar />}
                title="Book Appointments"
                desc="Find available time slots and book instantly."
              />
              <FeatureCard
                icon={<Clock />}
                title="Manage Easily"
                desc="View, reschedule, or cancel appointments."
              />
              <FeatureCard
                icon={<Bell />}
                title="Smart Reminders"
                desc="Receive reminder emails before appointments."
              />
              <FeatureCard
                icon={<LayoutDashboard />}
                title="Track & Stay Organized"
                desc="Keep track of all appointments in one place."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const FeatureMiniCard = ({ icon, title, desc, color }) => (
  <div className="flex gap-3 items-start">
    <div className={`p-3 rounded-xl ${color} text-white`}>{icon}</div>
    <div>
      <h4 className="text-white font-semibold">{title}</h4>
      <p className="text-sm text-blue-100/70">{desc}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-blue-100/70">{desc}</p>
  </div>
);

const MockNavItem = ({ icon, children, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-3 cursor-pointer ${
      active
        ? "bg-blue-500/20 text-blue-300"
        : "text-blue-100/70 hover:bg-white/5"
    }`}
  >
    {icon}
    <span>{children}</span>
  </div>
);

const AppointmentCard = ({ name, date, time, status, statusColor }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
    <div>
      <h4 className="text-white font-semibold">{name}</h4>
      <p className="text-sm text-blue-100/70">{date}</p>
      <p className="text-sm text-blue-100/70">{time}</p>
    </div>
    <span className={`px-3 py-1 rounded-full text-xs ${statusColor}`}>
      {status}
    </span>
  </div>
);

export default Homepage;
