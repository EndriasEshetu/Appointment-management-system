export default function Footer() {
  return (
    <footer
      className="w-full bg-[#1e2f40] text-slate-300 text-sm py-6 px-8 shadow-inner mt-auto"
      id="contact"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="order-2 md:order-1">
          Developed by:
          <a
            className="text-white font-semibold hover:text-green-400 transition ml-1"
            href="https://endrias.tech"
            target="_blank"
            rel="noreferrer"
          >
            Endrias Eshetu
          </a>
        </p>

        <p className="order-3 md:order-2 text-center">
          &copy; {new Date().getFullYear()} Appointment Management System. All
          rights reserved.
        </p>

        <div className="flex gap-6 order-1 md:order-3">
          <a
            href="https://github.com/EndriasEshetu/Appointment-management-system"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition font-medium"
          >
            GitHub Repo
          </a>
          <a
            href="https://www.linkedin.com/in/endrias-eshetu"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition font-medium"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
