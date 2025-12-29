
import React, { useState } from 'react';
import { MoodEntry, Activity } from '../types';

interface DashboardProps {
  moods: MoodEntry[];
  onAddMood: (mood: number, stress: number) => void;
  activities: Activity[];
}

const Dashboard: React.FC<DashboardProps> = ({ moods, onAddMood, activities }) => {
  const [moodVal, setMoodVal] = useState(3);
  const [stressVal, setStressVal] = useState(3);

  // Fix: Explicitly return string to satisfy parseFloat and StatCard component props
  const getAverage = (key: 'mood' | 'stress'): string => {
    if (moods.length === 0) return "0.0";
    return (moods.reduce((acc, curr) => acc + curr[key], 0) / moods.length).toFixed(1);
  };

  const todayCompleted = activities.filter(a => a.completed).length;

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">How are you today?</h2>
        <p className="text-slate-500 mb-6">Daily check-ins help identify patterns in your well-being.</p>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-700">Current Mood</label>
              <span className="text-2xl">{['😢', '😕', '😐', '🙂', '😄'][moodVal - 1]}</span>
            </div>
            <input 
              type="range" min="1" max="5" value={moodVal} 
              onChange={(e) => setMoodVal(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-700">Stress Level</label>
              <span className="text-sm font-medium text-slate-500">{['Very Low', 'Low', 'Moderate', 'High', 'Extreme'][stressVal - 1]}</span>
            </div>
            <input 
              type="range" min="1" max="5" value={stressVal} 
              onChange={(e) => setStressVal(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <button 
            onClick={() => onAddMood(moodVal, stressVal)}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            Save Check-in
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Avg Mood" value={getAverage('mood')} sub="Out of 5" color="text-emerald-600" />
        <StatCard title="Avg Stress" value={getAverage('stress')} sub="Out of 5" color="text-amber-600" />
        <StatCard title="Activities" value={`${todayCompleted}/${activities.length}`} sub="Done today" color="text-indigo-600" />
      </div>

      <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900 mb-1">Weekly Insight</h3>
        <p className="text-indigo-800/70 text-sm">
          {moods.length < 3 
            ? "Keep checking in! We'll show your patterns once you have a few days of data."
            : parseFloat(getAverage('stress')) > 3.5 
              ? "Your stress levels are trending high. Consider trying a breathing activity or talking to our AI Listener."
              : "You're doing great! Consistent mood tracking helps you stay in tune with yourself."}
        </p>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; sub: string; color: string }> = ({ title, value, sub, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className={`text-3xl font-bold my-1 ${color}`}>{value}</p>
    <p className="text-slate-400 text-xs">{sub}</p>
  </div>
);

export default Dashboard;
