import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Compass,
  Layers3,
  Layout,
  Smartphone,
} from "lucide-react";

const categories = [
  {
    name: "Frontend Engineering",
    description: "Interfaces, React, UI systems",
    query: "Frontend",
    icon: Layout,
  },
  {
    name: "Backend Engineering",
    description: "APIs, services, databases",
    query: "Backend",
    icon: Code2,
  },
  {
    name: "UI / UX Design",
    description: "Product and visual design",
    query: "Design",
    icon: Compass,
  },
  {
    name: "Product Management",
    description: "Strategy, delivery, operations",
    query: "Manager",
    icon: Layers3,
  },
  {
    name: "Full Stack Development",
    description: "End-to-end web applications",
    query: "Full Stack",
    icon: BriefcaseBusiness,
  },
  {
    name: "Mobile Development",
    description: "Android, iOS, cross-platform",
    query: "Mobile",
    icon: Smartphone,
  },
];

export default function PopularCategories() {
  const navigate = useNavigate();

  const handleCategoryClick = (query) => {
    navigate(`/jobs?category=${encodeURIComponent(query)}`);
  };

  return (
    <section className="section border-b border-white/[0.04]">
      <div className="site-container">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="section-eyebrow w-fit">
              <Layers3 className="h-3.5 w-3.5" />
              Explore by category
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start with a direction.
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              Explore opportunities across some of the most common roles on the
              platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-violet-300 transition-colors hover:text-violet-200"
          >
            View all jobs
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => handleCategoryClick(category.query)}
                className="glass group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20"
              >
                <div className="absolute right-4 top-4 text-[10px] font-bold tracking-[0.18em] text-slate-700">
                  0{index + 1}
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.06] text-violet-300 transition-all duration-300 group-hover:border-violet-400/20 group-hover:bg-violet-400/[0.1]">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-white transition-colors group-hover:text-violet-200">
                  {category.name}
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors group-hover:text-violet-300">
                  Explore category
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
