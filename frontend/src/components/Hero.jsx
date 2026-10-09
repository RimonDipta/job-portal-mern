import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { useAppStore } from "../store/useAppStore";

export default function Hero() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();
  const { user } = useAppStore();

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const query = params.toString();

    navigate(query ? `/jobs?${query}` : "/jobs");
  };

  const handlePopularSearch = (value) => {
    navigate(`/jobs?keyword=${encodeURIComponent(value)}`);
  };

  const isRecruiter = user?.role === "recruiter";

  return (
    <section className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/[0.08] blur-[120px]" />

        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[120px]" />

        <div className="subtle-grid absolute inset-0 opacity-50" />
      </div>

      <div className="site-container relative">
        <div className="grid min-h-[calc(100vh-76px)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-20">
          {/* Copy */}
          <div className="max-w-3xl">
            <div className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5" />
              {isRecruiter
                ? "Build your next great team"
                : "Your next opportunity starts here"}
            </div>

            <h1 className="text-balance text-5xl font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-6xl lg:text-[76px]">
              {isRecruiter ? (
                <>
                  Find people who
                  <span className="gradient-text block">
                    move your company forward.
                  </span>
                </>
              ) : (
                <>
                  Work that fits
                  <span className="gradient-text block">your ambition.</span>
                </>
              )}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              {isRecruiter
                ? "Publish opportunities, discover qualified candidates, and manage your entire hiring workflow from one focused workspace."
                : "Discover meaningful opportunities from growing teams and established companies. Search, apply, and keep your career moving forward."}
            </p>

            {/* Search */}
            {!isRecruiter && (
              <form
                onSubmit={handleSearch}
                className="glass mt-9 rounded-2xl p-2.5 shadow-2xl shadow-black/20"
              >
                <div className="grid gap-2 lg:grid-cols-[1fr_0.85fr_auto]">
                  <label className="flex min-h-14 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 transition-colors focus-within:border-violet-500/40 focus-within:bg-white/[0.04]">
                    <Search className="h-5 w-5 shrink-0 text-violet-400" />

                    <span className="sr-only">Job title or keyword</span>

                    <input
                      type="text"
                      value={keyword}
                      onChange={(event) => setKeyword(event.target.value)}
                      placeholder="Job title, skill, or company"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </label>

                  <label className="flex min-h-14 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 transition-colors focus-within:border-violet-500/40 focus-within:bg-white/[0.04]">
                    <MapPin className="h-5 w-5 shrink-0 text-cyan-400" />

                    <span className="sr-only">Location</span>

                    <input
                      type="text"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="Location or remote"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </label>

                  <button type="submit" className="btn-primary min-h-14 px-6">
                    Search jobs
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {isRecruiter && (
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="btn-primary"
                >
                  Open recruiter dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/jobs")}
                  className="btn-secondary"
                >
                  Browse the marketplace
                </button>
              </div>
            )}

            {/* Popular searches */}
            {!isRecruiter && (
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="mr-1 text-slate-600">Popular:</span>

                {["React", "Node.js", "Full Stack", "UI/UX"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePopularSearch(item)}
                    className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-slate-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.06] hover:text-violet-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/[0.07] pt-6 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Verified opportunities
              </span>

              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-400" />
                Candidate-first workflow
              </span>

              <span className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-cyan-400" />
                Built for modern hiring
              </span>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-8 rounded-[40px] bg-violet-500/[0.08] blur-3xl" />

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0c182a] p-3 shadow-2xl shadow-black/30">
              {/* Window header */}
              <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>

                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
                  JobPortal workspace
                </span>
              </div>

              {/* Dashboard visual */}
              <div className="mt-3 grid gap-3 sm:grid-cols-[0.72fr_1.28fr]">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="h-2 w-16 rounded-full bg-violet-400/50" />

                  <div className="mt-5 space-y-2.5">
                    {[0.82, 0.65, 0.91, 0.55, 0.72].map((width, index) => (
                      <div
                        key={index}
                        className="h-9 rounded-xl border border-white/[0.04] bg-white/[0.025] p-2"
                      >
                        <div
                          className="h-full rounded-lg bg-gradient-to-r from-violet-500/20 to-cyan-400/10"
                          style={{ width: `${width * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl bg-violet-500/[0.08] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        Applications
                      </span>

                      <span className="text-xs font-bold text-violet-300">
                        2,480
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Open positions
                        </p>

                        <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                          128
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                        <BriefcaseBusiness className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-5 flex items-end gap-1.5">
                      {[35, 50, 42, 68, 58, 78, 88, 74, 96].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-violet-500/20 to-violet-400/70"
                            style={{ height: `${height}px` }}
                          />
                        ),
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Recent match
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          Senior Frontend Engineer
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                        94% match
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-300">
                        <Users className="h-4 w-4" />
                      </div>

                      <div className="flex-1">
                        <div className="h-2 w-28 rounded-full bg-white/[0.08]" />
                        <div className="mt-2 h-1.5 w-20 rounded-full bg-white/[0.04]" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.07] to-violet-500/[0.07] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                        <CheckCircle2 className="h-5 w-5 text-cyan-300" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Everything in one place
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Search, apply, review, hire.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="animate-float absolute -right-3 top-28 rounded-2xl border border-white/10 bg-[#101d31]/95 p-3 shadow-xl backdrop-blur-xl sm:-right-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-500">
                      New opportunity
                    </p>
                    <p className="text-xs font-semibold text-white">
                      Application accepted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
