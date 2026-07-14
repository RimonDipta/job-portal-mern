import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Marcus Brody',
      role: 'Frontend Engineer @ Google',
      text: 'Within two weeks of signing up, I was contacted by three tech companies. The simplified application process and layout transparency made my career pivot incredibly smooth.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      stars: 5,
    },
    {
      name: 'Jessica Vance',
      role: 'Recruiting Manager @ Stripe',
      text: 'Sorting through job applications used to take our HR team hours. The recruiter applicant dashboard lets us filter and respond to candidates instantly. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      stars: 5,
    },
    {
      name: 'Alan Turing',
      role: 'Backend Developer @ Meta',
      text: 'The absolute best job portal interface I have used. Very clean, no cluttered popups, and the instant application trackers keep you updated without checking your inbox constantly.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      stars: 5,
    }
  ];

  return (
    <div className="bg-slate-900 py-20 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Read stories of professional developers and managers finding their teams using JobPortal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-slate-850/35 glass border border-slate-800 p-8 rounded-2xl relative flex flex-col justify-between hover:border-slate-700 transition-colors">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-violet-500/10 shrink-0" />
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(rev.stars)].map((_, idx) => (
                    <Star key={idx} className="h-4.5 w-4.5 fill-amber-500 text-amber-500 shrink-0" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="h-10 w-10 rounded-full border border-violet-500/20 object-cover shrink-0"
                />
                <div>
                  <h4 className="text-white font-bold text-sm">{rev.name}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
