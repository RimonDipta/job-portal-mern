import React from 'react';
import { Award, Compass, Heart, Users } from 'lucide-react';

export default function AboutUs() {
  const values = [
    { title: 'Innovation', desc: 'We continuously improve and refine our candidate matching and filtering processes to deliver optimal matches.', icon: Compass, color: 'text-violet-400 bg-violet-950/40' },
    { title: 'Transparency', desc: 'We maintain absolute clarity in applicant processing logs. No silent rejections or black-box statuses.', icon: Award, color: 'text-blue-400 bg-blue-950/40' },
    { title: 'Community Support', desc: 'We support local tech networks and partner with fast growing startup workspaces to help engineers find homes.', icon: Users, color: 'text-emerald-400 bg-emerald-950/40' },
    { title: 'Empathy', desc: 'Job search is a deeply personal journey. We build with sensitivity, making sure our platforms are clean and stress-free.', icon: Heart, color: 'text-pink-400 bg-pink-950/40' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Banner Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">About Our Job Portal</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Connecting brilliant global talent with leading technology organizations. We design tools to support developer portfolios and optimize recruiting workflows.
          </p>
        </div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 bg-slate-850/20 glass p-8 md:p-12 rounded-3xl border border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision & Story</h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-6">
              Founded in 2026, JobPortal began as a simple matching tool to help engineering candidates bypass traditional resumes and connect directly with hiring leads. Over time, we have expanded to cover roles in engineering, product design, operations, and leadership globally.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              We believe hiring should be based on real skills, verifiable capabilities, and open transparent updates. Our direct application logs mean you are never left guessing where you stand.
            </p>
          </div>
          <div className="h-64 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <span className="text-white font-extrabold text-xl tracking-widest relative z-10">CONNECTING FUTURES</span>
          </div>
        </div>

        {/* Core Values grid */}
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-slate-850/40 glass border border-slate-800 p-6 rounded-2xl flex gap-4 hover:border-slate-700 transition-colors">
                <div className={`p-3.5 rounded-xl shrink-0 h-fit ${v.color} border border-white/5`}>
                  <v.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1.5 text-md">{v.title}</h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
