import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  BriefcaseBusiness,
  ChevronDown,
} from "lucide-react";

import { useAppStore } from "../store/useAppStore";

export default function Header() {
  const { user, logout } = useAppStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();

    setShowDropdown(false);
    setIsOpen(false);

    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="glass-nav">
        <div className="site-container">
          <div className="flex h-[76px] items-center justify-between">
            {/* Brand */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="group flex shrink-0 items-center"
              aria-label="JobPortal home"
            >
              <img
                src="/brand/logo.svg"
                alt="JobPortal"
                className="h-10 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-1 md:flex">
              <Link
                to="/"
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-white/[0.06] text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                Home
              </Link>

              {(!user || user.role === "candidate") && (
                <Link
                  to="/jobs"
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive("/jobs")
                      ? "bg-white/[0.06] text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  Find Jobs
                </Link>
              )}

              {user?.role === "recruiter" && (
                <Link
                  to="/dashboard"
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "bg-white/[0.06] text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/about"
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive("/about")
                    ? "bg-white/[0.06] text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                About
              </Link>

              <Link
                to="/contact"
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive("/contact")
                    ? "bg-white/[0.06] text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Desktop account actions */}
            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown((current) => !current)}
                    className="focus-ring flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 transition-all hover:border-white/15 hover:bg-white/[0.07]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                      <User className="h-4 w-4" />
                    </div>

                    <div className="hidden text-left lg:block">
                      <p className="max-w-[130px] truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>

                      <p className="text-[11px] capitalize text-slate-500">
                        {user.role}
                      </p>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#0d192b]/95 p-2 shadow-2xl backdrop-blur-xl">
                      <div className="border-b border-white/[0.07] px-3 py-3">
                        <p className="truncate text-sm font-semibold text-white">
                          {user.name}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>

                      {user.role === "recruiter" && (
                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Recruiter Dashboard
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-400 transition-colors hover:bg-rose-500/[0.08] hover:text-rose-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary px-4 py-2.5">
                    Sign in
                  </Link>

                  <Link to="/register" className="btn-primary px-4 py-2.5">
                    Get started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white md:hidden"
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile navigation */}
          {isOpen && (
            <div className="border-t border-white/[0.07] py-4 md:hidden">
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white"
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  Home
                </Link>

                {(!user || user.role === "candidate") && (
                  <Link
                    to="/jobs"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  >
                    <BriefcaseBusiness className="h-4 w-4" />
                    Find Jobs
                  </Link>
                )}

                {user?.role === "recruiter" && (
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}

                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white"
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white"
                >
                  Contact
                </Link>
              </div>

              <div className="mt-4 border-t border-white/[0.07] pt-4">
                {user ? (
                  <div className="space-y-1">
                    <div className="mb-2 rounded-xl bg-white/[0.03] px-4 py-3">
                      <p className="text-sm font-semibold text-white">
                        {user.name}
                      </p>

                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {user.role}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    >
                      Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/[0.08]"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="btn-secondary"
                    >
                      Sign in
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="btn-primary"
                    >
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
