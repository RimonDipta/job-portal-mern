import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Code2,
  Compass,
  Database,
  Figma,
  Layers3,
  Smartphone,
} from "lucide-react";

export default function PopularCategories() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Frontend",
      description: "React, Vue, Angular & modern web",
      query: "Frontend",
      icon: Code2,
      accent: "from-violet-500/20 to-violet-500/0",
      iconClass: "text-violet-300 bg-violet-400/10",
    },
    {
      name: "Backend",
      description: "APIs, services & server systems",
      query: "Backend",
      icon: Database,
      accent: "from-cyan-500/20 to-cyan-500/0",
      iconClass: "text-cyan-300 bg-cyan-400/10",
    },
    {
      name: "Product Design",
      description: "UI, UX & digital experiences",
      query: "Design",
      icon: Figma,
      accent: "from-pink-500/20 to-pink-500/0",
      iconClass: "text-pink-300 bg-pink-400/10",
    },
    {
      name: "Product",
      description: "Strategy, research & leadership",
      query: "Manager",
      icon: Compass,
      accent: "from-amber-500/20 to-amber-500/0",
      iconClass: "text-amber-300 bg-amber-400/10",
    },
    {
      name: "Full Stack",
      description: "End-to-end application development",
      query: "Full Stack",
      icon: Layers3,
      accent: "from-indigo-500/20 to-indigo-500/0",
      iconClass: "text-indigo-300 bg-indigo-400/10",
    },
    {
      name: "Mobile",
      description: "iOS, Android & cross-platform apps",
      query: "Mobile",
      icon: Smartphone,
      accent: "from-emerald-500/20 to-emerald-500/0",
      iconClass: "text-emerald-300 bg-emerald-400/10",
    },
  ];

  return (
    <section className="section border-b border-white/[0.06]">
      <div className="site-container">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="section-eyebrow">Explore opportunities</span>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Find work in your field.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Browse focused job categories and discover roles that match the
              way you want to build your career.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200"
          >
            Browse all jobs
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() =>
                  navigate(
                    `/jobs?category=${encodeURIComponent(category.query)}`,
                  )
                }
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.035]"
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${category.accent} opacity-70`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${category.iconClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-slate-700 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-300" />
                  </div>

                  <h3 className="mt-6 text-base font-semibold text-white">
                    {category.name}
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
