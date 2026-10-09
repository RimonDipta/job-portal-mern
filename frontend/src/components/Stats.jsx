import React from "react";
import { BriefcaseBusiness, Building2, ShieldCheck, Users } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      value: "2",
      label: "User roles",
      description: "Candidates & recruiters",
      icon: Users,
    },
    {
      value: "10+",
      label: "Core workflows",
      description: "From search to hiring",
      icon: BriefcaseBusiness,
    },
    {
      value: "JWT",
      label: "Authentication",
      description: "Protected API access",
      icon: ShieldCheck,
    },
    {
      value: "MERN",
      label: "Technology stack",
      description: "React, Node, MongoDB",
      icon: Building2,
    },
  ];

  return (
    <section className="border-y border-white/[0.06] bg-[#091423]/70">
      <div className="site-container">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`group px-5 py-8 sm:px-8 ${
                  index < stats.length - 1 ? "border-r border-white/[0.06]" : ""
                } ${
                  index < 2 ? "border-b lg:border-b-0 border-white/[0.06]" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.06] text-violet-300 transition-transform duration-200 group-hover:scale-105">
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <div>
                    <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-300 sm:text-sm">
                      {stat.label}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
