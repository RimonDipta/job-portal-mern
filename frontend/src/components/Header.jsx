import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Briefcase, Menu, X, User, LogOut, LayoutDashboard, FileText } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-violet-400 font-extrabold text-xl tracking-wider hover:opacity-95 transition-opacity">
              <Briefcase className="h-6 w-6 text-violet-500" />
              <span>JOB<span className="text-white">PORTAL</span></span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-6">
                <Link to="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                {(!user || user.role === 'candidate') && (
                  <Link to="/jobs" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Find Jobs</Link>
                )}
                {user?.role === 'recruiter' && (
                  <Link to="/dashboard" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Recruiter Dashboard</Link>
                )}
                <Link to="/about" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">About Us</Link>
                <Link to="/contact" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-full border border-slate-700 text-sm font-medium transition-all duration-200 shadow-md focus:outline-none"
                >
                  <User className="h-4 w-4 text-violet-400" />
                  <span>{user.name}</span>
                  <span className="text-xs text-violet-300 bg-violet-950/50 px-2 py-0.5 rounded-full border border-violet-900/30 uppercase">
                    {user.role}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-slate-850 glass border border-slate-700 py-1 z-50 transform origin-top-right">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      View Profile
                    </Link>
                    
                    {user.role === 'recruiter' ? (
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        Recruiter Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/profile?tab=applied"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                      >
                        <FileText className="h-4 w-4 text-slate-400" />
                        My Applications
                      </Link>
                    )}
                    
                    <div className="border-t border-slate-700 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-600/20">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-lg focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass px-2 pt-2 pb-4 space-y-1 sm:px-3 border-t border-slate-800">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Home</Link>
          {(!user || user.role === 'candidate') && (
            <Link to="/jobs" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Find Jobs</Link>
          )}
          {user?.role === 'recruiter' && (
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Recruiter Dashboard</Link>
          )}
          <Link to="/about" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">About Us</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">Contact</Link>
          
          <div className="border-t border-slate-700 my-2 pt-2">
            {user ? (
              <div className="space-y-1 px-3">
                <div className="text-sm font-medium text-violet-400 py-1 flex items-center justify-between">
                  <span>Logged in as {user.name}</span>
                  <span className="text-xs uppercase bg-violet-950 px-2 py-0.5 rounded border border-violet-850 text-violet-300">{user.role}</span>
                </div>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Profile</Link>
                {user.role === 'recruiter' && (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">Recruiter Dashboard</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-rose-400 hover:text-rose-300 py-2 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center text-slate-300 hover:text-white border border-slate-700 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="text-center bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
