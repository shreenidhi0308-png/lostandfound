import { Link, NavLink } from "react-router-dom";
import {
  Search,
  Plus,
  Bell,
  CircleHelp,
} from "lucide-react";

function Navbar() {
  const navClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive
        ? "text-black"
        : "text-black/45 hover:text-black"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f3ee]/90 backdrop-blur-xl">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">

          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] text-[#f5f3ee]">

            <Search size={19} />

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#ff5c35]" />

          </div>

          <div>
            <div className="text-lg font-black tracking-tight">
              TRACE
            </div>

            <div className="text-[9px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Lost & Found
            </div>
          </div>

        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-8 md:flex">

          <NavLink
            to="/"
            end
            className={navClass}
          >
            Discover
          </NavLink>

         

          

        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">

          {/* HELP */}
          <NavLink
            to="/how"
            className="hidden rounded-full p-3 transition hover:bg-black/5 sm:block"
            title="How it works"
          >
            <CircleHelp size={18} />
          </NavLink>

          {/* NOTIFICATIONS */}
          <NavLink
            to="/notifications"
            className="hidden rounded-full p-3 transition hover:bg-black/5 sm:block"
            title="Notifications"
          >
            <Bell size={18} />
          </NavLink>

          <Link
  to="/report"
  className="group flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#ff5c35]"
>
  <Plus size={17} />

  <span className="hidden sm:inline">
    Report item
  </span>
</Link>

        </div>

      </div>

    </header>
  );
}

export default Navbar;