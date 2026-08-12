"use client";
import NavItems from "./NavItems";
import SchoolIcon from "@mui/icons-material/School";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <SchoolIcon className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Elearning
          </span>
        </Link>

        {/* Navigation Items */}
        <NavItems className="flex items-center gap-6 text-sm font-medium" />
      </div>
    </header>
  );
};

export default Header;

