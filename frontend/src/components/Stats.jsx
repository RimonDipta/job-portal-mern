import React from "react";
import {
  BriefcaseBusiness,
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";

const stats = [
  {
    value: "2",
    label: "Platform roles",
    description: "Candidates & recruiters",
    icon: Users,
  },
  {
    value: "JWT",
    label: "Authentication",
    description: "Protected API sessions",
    icon: LockKeyhole,
  },
  {
    value: "RBAC",
    label: "Authorization",
    description: "Role-based access control",
    icon: ShieldCheck,
  },
  {
    value: "MERN",
    label: "Technology stack",
    description: "React, Node, Express & MongoDB",
    icon: BriefcaseBusiness,
  },
];

export default function Stats() {
  return (
    <section className="border-y border-white/[0.04] bg-white/[0.01]">
      <div className="site-container py-6">
        <div className="grid grid-cols-2 divide-x divide-white/[0.05] lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group flex items-center gap-3 px-4 py-4 first:pl-0 last:pr-0 sm:gap-4 sm:px-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.06] text-violet-300 transition-all duration-300 group-hover:border-violet-400/20 group-hover:bg-violet-400/[0.1]">
                  <Icon className="h-[18px] w-[18px]" />
                </div>

                <div className="min-w-0">
                  <p className="text-base font-bold tracking-tight text-white sm:text-lg">
                    {stat.value}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 sm:text-xs">
                    {stat.label}
                  </p>

                  <p className="mt-0.5 hidden truncate text-[10px] text-slate-700 sm:block">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
