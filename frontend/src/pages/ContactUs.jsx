import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Contact Our Team</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            Have questions about candidates, recruiter account verification, or system features? Send us a message and we'll reply shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-6">
            <div className="bg-slate-850/30 glass border border-slate-800 p-6 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-violet-950 rounded-xl text-violet-400 border border-violet-900/30 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Email Address</h4>
                <p className="text-xs text-slate-400 mt-1">Our support queue is open 24/7.</p>
                <a href="mailto:support@jobportal.com" className="text-sm font-semibold text-violet-400 hover:text-violet-300 block mt-2">
                  support@jobportal.com
                </a>
              </div>
            </div>

            <div className="bg-slate-850/30 glass border border-slate-800 p-6 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-violet-950 rounded-xl text-violet-400 border border-violet-900/30 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Phone Number</h4>
                <p className="text-xs text-slate-400 mt-1">Mon-Fri from 9am to 6pm PST.</p>
                <span className="text-sm font-semibold text-white block mt-2">
                  +1 (555) 019-2834
                </span>
              </div>
            </div>

            <div className="bg-slate-850/30 glass border border-slate-800 p-6 rounded-2xl flex items-start gap-4">
              <div className="p-3 bg-violet-950 rounded-xl text-violet-400 border border-violet-900/30 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Office Address</h4>
                <p className="text-xs text-slate-400 mt-1">Headquarters and lab location.</p>
                <span className="text-sm font-semibold text-slate-350 block mt-2 leading-relaxed">
                  123 Innovation Way, Suite 400,<br />Tech City, TC 94016
                </span>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            <div className="bg-slate-850/40 glass border border-slate-800 p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-6">Send Us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 text-sm flex items-center gap-2.5 font-medium">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <span>Your message has been sent successfully! Our agents will contact you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    rows="5"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain your inquiry in detail..."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 placeholder:text-slate-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-violet-600/20"
                >
                  <Send className="h-4.5 w-4.5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
