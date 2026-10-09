import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  PlusCircle,
  Search,
  Sparkles,
} from "lucide-react";

import { useAppStore } from "../store/useAppStore";

const popularSearches = ["React", "Node.js", "Full Stack", "UI/UX"];

export default function Hero() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();
  const { user } = useAppStore();

  const isRecruiter = user?.role === "recruiter";

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

  return (
    <section className="relative overflow-hidden border-b border-white/[0.04]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[-180px] h-[500px] w-[500px] rounded-full bg-violet-600/[0.09] blur-[140px]" />

        <div className="absolute right-[-100px] top-[100px] h-[500px] w-[500px] rounded-full bg-cyan-400/[0.045] blur-[150px]" />

        <div className="absolute bottom-[-200px] left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/[0.04] blur-[140px]" />
      </div>

      <div className="site-container">
        <div className="grid min-h-[680px] items-center gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-4 lg:py-20">
          {/* =========================================================
              LEFT â€” HERO CONTENT
          ========================================================== */}
          <div className="relative z-10 max-w-2xl">
            <div className="section-eyebrow mb-6 w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              {isRecruiter
                ? "Build your next team"
                : "Find your next opportunity"}
            </div>

            {isRecruiter ? (
              <>
                <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[4.25rem]">
                  Find people who
                  <span className="block gradient-text">
                    move things forward.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                  Publish roles, review applicants, access candidate resumes,
                  and manage your hiring workflow from one focused workspace.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="btn-primary inline-flex items-center justify-center gap-2"
                  >
                    Open recruiter workspace
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/jobs")}
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    Browse marketplace
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[4.25rem]">
                  Work that fits
                  <span className="block gradient-text">your ambition.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                  Discover relevant opportunities, apply with confidence, and
                  keep your applications organized from one place.
                </p>

                {/* Search */}
                <form
                  onSubmit={handleSearch}
                  className="glass mt-8 rounded-2xl p-2 shadow-2xl shadow-black/20"
                >
                  <div className="grid gap-2 md:grid-cols-[1fr_0.8fr_auto]">
                    {/* Keyword */}
                    <div className="flex min-w-0 items-center rounded-xl border border-transparent bg-white/[0.025] px-4 transition-colors focus-within:border-violet-400/20 focus-within:bg-white/[0.04]">
                      <Search className="mr-3 h-4 w-4 shrink-0 text-violet-300" />

                      <input
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Job title, skill, or keyword"
                        className="min-w-0 w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600"
                      />
                    </div>

                    {/* Location */}
                    <div className="flex min-w-0 items-center rounded-xl border border-transparent bg-white/[0.025] px-4 transition-colors focus-within:border-violet-400/20 focus-within:bg-white/[0.04]">
                      <MapPin className="mr-3 h-4 w-4 shrink-0 text-cyan-300" />

                      <input
                        type="text"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="Location or remote"
                        className="min-w-0 w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="btn-primary inline-flex min-h-[46px] items-center justify-center gap-2 px-5"
                    >
                      <Search className="h-4 w-4" />
                      Search
                    </button>
                  </div>
                </form>

                {/* Popular searches */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-700">
                    Popular
                  </span>

                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      type="button"
                      onClick={() => handlePopularSearch(search)}
                      className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-slate-500 transition-all hover:border-violet-400/20 hover:bg-violet-400/[0.05] hover:text-violet-300"
                    >
                      {search}
                    </button>
                  ))}
                </div>

                {/* Recruiter CTA */}
                <div className="mt-7 flex items-center gap-3 border-t border-white/[0.05] pt-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.05] text-violet-300">
                    <BriefcaseBusiness className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Hiring instead?
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-slate-300 transition-colors hover:text-violet-300"
                    >
                      Create a recruiter account
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* =========================================================
              RIGHT â€” GENERATED HERO ART
          ========================================================== */}
          <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[620px]">
            {/* Glow behind artwork */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.12] blur-[100px] sm:h-[500px] sm:w-[500px]" />

            <div className="relative w-full max-w-[720px]">
              {/* Image */}
              <img
                src="/hero-career-illustration.png"
                alt="Futuristic career platform illustration"
                className="relative z-10 h-auto w-full object-contain drop-shadow-[0_30px_80px_rgba(76,29,149,0.25)]"
              />

              {/* Floating status card */}
              <div className="absolute bottom-[8%] left-[4%] z-20 hidden rounded-2xl border border-white/[0.08] bg-[#0b1628]/85 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <PlusCircle className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                      Platform
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-slate-200">
                      Built for both sides
                    </p>
                  </div>
                </div>
              </div>

              {/* Small accent */}
              <div className="absolute right-[7%] top-[16%] z-20 hidden h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.8)] sm:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
