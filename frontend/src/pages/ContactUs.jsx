import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Github,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const inputClassName =
  "w-full rounded-xl border border-white/[0.08] bg-[#091525]/80 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSubmitted(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [submitted]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="relative overflow-hidden">
      {/* =========================================================
          BACKGROUND ATMOSPHERE
      ========================================================== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-0 h-[480px] w-[620px] rounded-full bg-violet-600/10 blur-[150px]" />

        <div className="absolute -right-20 top-[600px] h-[360px] w-[360px] rounded-full bg-cyan-400/5 blur-[120px]" />

        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />
      </div>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="section pb-10">
        <div className="site-container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="section-eyebrow mx-auto w-fit">
              <MessageSquare className="h-3.5 w-3.5" />
              Contact
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Let&apos;s start a{" "}
              <span className="gradient-text">conversation.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              Have a question about the platform, candidate experience, or
              recruiter workflow? Use the form below to explore the contact
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <section className="section pt-8">
        <div className="site-container">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            {/* =====================================================
                LEFT — INFORMATION
            ====================================================== */}
            <aside className="space-y-4">
              {/* Project information */}
              <div className="glass rounded-3xl p-6 sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Mail className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-white">
                  Project contact
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This project is currently presented as a portfolio
                  application. There is no dedicated support mailbox connected
                  to the platform yet.
                </p>

                <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                    Current status
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-300">
                    Frontend contact experience
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Backend message delivery can be connected as a future
                    feature.
                  </p>
                </div>
              </div>

              {/* Platform questions */}
              <div className="glass rounded-3xl p-6 sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <MessageSquare className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-white">
                  Platform questions
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Explore job discovery, applications, recruiter tools, and
                  account workflows directly in the application.
                </p>

                <Link
                  to="/jobs"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                >
                  Explore the platform
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Project links */}
              <div className="glass rounded-3xl p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Project links
                </p>

                <div className="mt-5">
                  <a
                    href="https://github.com/RimonDipta/job-portal-mern"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
                  >
                    <Github className="h-4 w-4" />
                    GitHub repository
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </aside>

            {/* =====================================================
                RIGHT — FORM
            ====================================================== */}
            <div className="glass rounded-3xl p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="flex items-center gap-2 text-violet-300">
                    <Sparkles className="h-4 w-4" />

                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      Send a message
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
                    How can we help?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Fill out the form to experience the contact workflow.
                    Message delivery is not connected to a backend service yet.
                  </p>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025] text-slate-500 sm:flex">
                  <Send className="h-5 w-5" />
                </div>
              </div>

              {/* Success */}
              {submitted && (
                <div className="mt-7 flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                  <div>
                    <p className="text-sm font-semibold text-emerald-200">
                      Message submitted
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-300/70">
                      The form interaction was completed successfully in this
                      demo interface. No message was sent to an external
                      service.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* Name + email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"
                    >
                      Name
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"
                    >
                      Email
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className={inputClassName}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"
                  >
                    Message
                  </label>

                  <textarea
                    id="contact-message"
                    rows={7}
                    required
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tell us what you would like to know..."
                    className={`${inputClassName} resize-y`}
                  />
                </div>

                {/* Form disclosure + action */}
                <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-md text-xs leading-5 text-slate-600">
                    This form currently demonstrates the frontend interaction
                    only. It does not send or store your message.
                  </p>

                  <button
                    type="submit"
                    className="btn-primary inline-flex shrink-0 items-center justify-center gap-2"
                  >
                    Send message
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM CTA
      ========================================================== */}
      <section className="section pt-10">
        <div className="site-container">
          <div className="rounded-3xl border border-white/[0.05] bg-white/[0.02] p-7 text-center sm:p-10">
            <p className="text-sm text-slate-500">
              Looking for your next opportunity instead?
            </p>

            <Link
              to="/jobs"
              className="mt-3 inline-flex items-center gap-2 text-lg font-semibold text-white transition-colors hover:text-violet-300"
            >
              Browse available jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
