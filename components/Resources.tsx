
import React, { useState, useEffect } from 'react';
import * as gemini from '../services/geminiService';

const Resources: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [nearbyHelp, setNearbyHelp] = useState<{ text: string; links: any[] } | null>(null);

  const fetchHelp = async () => {
    setLoading(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const res = await gemini.findNearbyHelp(position.coords.latitude, position.coords.longitude);
          setNearbyHelp(res);
          setLoading(false);
        }, async () => {
          // Fallback if location denied
          const res = await gemini.searchResources("Mental health services for students");
          setNearbyHelp(res);
          setLoading(false);
        });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelp();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Support Resources</h2>
        <p className="text-slate-500">Finding professional help is a sign of strength, not weakness.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <EmergencyCard title="Crisis Text Line" number="Text HOME to 741741" sub="24/7 free text support" />
        <EmergencyCard title="Suicide Prevention" number="Dial 988" sub="Available 24/7 across the US" />
      </section>

      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Nearby Support Centers</h3>
          <button onClick={fetchHelp} className="text-indigo-600 text-xs font-bold hover:underline">Refresh</button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm">Finding clinics and counseling centers...</p>
          </div>
        ) : nearbyHelp ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">{nearbyHelp.text}</p>
            <div className="grid gap-2">
              {nearbyHelp.links.map((link, i) => (
                <a key={i} href={link.uri} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors border border-slate-100">
                  <span className="text-sm font-semibold text-slate-700">{link.title}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-400 py-12">No data found. Try refreshing your location.</p>
        )}
      </section>

      <section className="bg-slate-800 p-6 rounded-2xl text-white">
        <h3 className="text-lg font-bold mb-2">Anonymous Peer Support</h3>
        <p className="text-slate-300 text-sm mb-4">Connect with other students in a moderated, anonymous environment.</p>
        <button className="px-6 py-2 bg-indigo-500 rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors">
          Join Campus Discord
        </button>
      </section>
    </div>
  );
};

const EmergencyCard: React.FC<{ title: string; number: string; sub: string }> = ({ title, number, sub }) => (
  <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
    <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-1">{title}</h4>
    <p className="text-2xl font-black text-red-600 mb-1">{number}</p>
    <p className="text-xs text-red-700 opacity-70 font-medium">{sub}</p>
  </div>
);

export default Resources;
