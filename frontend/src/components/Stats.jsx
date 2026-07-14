import React from 'react';
import { Users, FileCheck, Building2, UserCheck } from 'lucide-react';

export default function Stats() {
  const stats = [
    { label: 'Active Candidates', value: '12k+', icon: Users, color: 'text-violet-450 bg-violet-950/40' },
    { label: 'Verified Companies', value: '450+', icon: Building2, color: 'text-blue-400 bg-blue-950/40' },
    { label: 'Jobs Fulfilled', value: '8.5k+', icon: FileCheck, color: 'text-emerald-400 bg-emerald-950/40' },
    { label: 'Applications Handled', value: '32k+', icon: UserCheck, color: 'text-indigo-450 bg-indigo-950/40' },
  ];

  return (
    <div className="bg-slate-900 py-16 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-850/30 glass p-6 rounded-2xl border border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-colors">
              <div className={`p-4 rounded-xl shrink-0 ${stat.color} border border-white/5`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</h3>
                <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
