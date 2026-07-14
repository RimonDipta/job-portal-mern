import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-850 text-slate-400 py-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-violet-400 font-extrabold text-xl tracking-wider">
              <Briefcase className="h-6 w-6 text-violet-500" />
              <span>JOB<span className="text-white">PORTAL</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-450">
              Connecting brilliant talent with leading companies worldwide. Find jobs that match your skills, values, and career aspirations.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Github className="h-5 w-5 text-slate-400 hover:text-white" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5 text-slate-400 hover:text-white" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5 text-slate-400 hover:text-white" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-violet-400 transition-colors">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-violet-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/about" className="hover:text-violet-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-violet-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Job Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs?category=frontend" className="hover:text-violet-400 transition-colors">Frontend Engineering</Link></li>
              <li><Link to="/jobs?category=backend" className="hover:text-violet-400 transition-colors">Backend Engineering</Link></li>
              <li><Link to="/jobs?category=design" className="hover:text-violet-400 transition-colors">UI/UX & Product Design</Link></li>
              <li><Link to="/jobs?category=product" className="hover:text-violet-400 transition-colors">Product Management</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                <span>123 Innovation Way, Suite 400, Tech City, TC 94016</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 text-violet-400" />
                <a href="mailto:support@jobportal.com" className="hover:text-white transition-colors">support@jobportal.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-violet-400" />
                <span>+1 (555) 019-2834</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
