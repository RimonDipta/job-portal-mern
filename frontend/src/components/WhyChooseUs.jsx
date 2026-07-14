import React from 'react';
import { Target, Award, ShieldCheck, Zap } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: 'Tailored Matchmaking', desc: 'Our search processes align your unique skills and locations with the precise requirements of employers.', icon: Target, bg: 'bg-violet-950/40 text-violet-400' },
    { title: 'Instant Application', desc: 'Apply with just a single click. Keep your professional profile updated and apply instantly to any position.', icon: Zap, bg: 'bg-amber-950/40 text-amber-400' },
    { title: 'Verified Positions Only', desc: 'No spam or ghost jobs. We verify every recruiter account to ensure you are connecting with legitimate employers.', icon: ShieldCheck, bg: 'bg-emerald-950/40 text-emerald-400' },
    { title: 'Track Applications Live', desc: 'Know exactly where your applications stand. Track status changes in real-time as recruiters process candidates.', icon: Award, bg: 'bg-blue-950/40 text-blue-400' },
  ];

  return (
    <div className="bg-slate-900 py-20 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Why Professionals Choose <br />
              <span className="text-violet-400">Our Job Portal</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We have redesigned the employment matching workflow from scratch. No endless registration loops, no black-box applications, just quick connections with direct feed logs.
            </p>
            <div className="bg-slate-850/35 glass p-6 rounded-2xl border border-slate-800 flex items-start gap-4">
              <span className="text-3xl font-extrabold text-violet-500">98%</span>
              <div>
                <h4 className="text-white font-bold mb-1">Satisfactory Job Success Rate</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Candidates matched via our smart query system report an optimal onboarding experience within the first 30 days.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {points.map((pt, i) => (
              <div key={i} className="bg-slate-850/45 glass border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                <div className={`p-3 rounded-xl shrink-0 w-fit mb-4 border border-white/5 ${pt.bg}`}>
                  <pt.icon className="h-5 w-5" />
                </div>
                <h3 className="text-white font-bold mb-2 text-md">{pt.title}</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
