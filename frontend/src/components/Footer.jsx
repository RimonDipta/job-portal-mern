import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, ArrowUpRight, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.07] bg-[#050c17]">
      <div className="site-container py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex" aria-label="JobPortal home">
              <img
                src="/brand/logo.svg"
                alt="JobPortal"
                className="h-10 w-auto"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              A modern recruitment platform connecting candidates with
              opportunities and helping recruiters build better teams.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>

              <a
                href="mailto:support@jobportal.com"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white">Platform</h3>

            <ul className="mt-5 space-y-3 text-sm text-slate-500">
              <li>
                <Link to="/jobs" className="transition-colors hover:text-white">
                  Find Jobs
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition-colors hover:text-white"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>

            <ul className="mt-5 space-y-4 text-sm text-slate-500">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />

                <span>Dhaka, Bangladesh</span>
              </li>

              <li>
                <a
                  href="mailto:support@jobportal.com"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  support@jobportal.com
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.07] pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} JobPortal. All rights reserved.</p>

          <p>Built with React, Node.js, Express & MongoDB.</p>
        </div>
      </div>
    </footer>
  );
}
