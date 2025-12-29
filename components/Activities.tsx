
import React, { useState } from 'react';
import { Activity, WeeklyGoal } from '../types';

interface ActivitiesProps {
  activities: Activity[];
  onToggle: (id: string) => void;
  weeklyGoals: WeeklyGoal[];
  onAddGoal: (text: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

const Activities: React.FC<ActivitiesProps> = ({ 
  activities, 
  onToggle, 
  weeklyGoals, 
  onAddGoal, 
  onToggleGoal, 
  onDeleteGoal 
}) => {
  const [newGoalText, setNewGoalText] = useState('');
  const categories = Array.from(new Set(activities.map(a => a.category)));

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalText.trim()) {
      onAddGoal(newGoalText.trim());
      setNewGoalText('');
    }
  };

  const completedGoals = weeklyGoals.filter(g => g.completed).length;
  const progressPercent = weeklyGoals.length > 0 ? (completedGoals / weeklyGoals.length) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Mindful Activities</h2>
        <p className="text-slate-500">Small actions, big impact. Try to complete these today.</p>
      </header>

      {/* Weekly Goals Section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Weekly Wellness Goals</h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
            {completedGoals}/{weeklyGoals.length} Done
          </span>
        </div>

        {weeklyGoals.length > 0 && (
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        )}

        <form onSubmit={handleAddGoal} className="flex gap-2">
          <input 
            type="text" 
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Add a new weekly goal..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button 
            type="submit"
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </form>

        <div className="space-y-2">
          {weeklyGoals.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4 italic">No goals set for this week yet.</p>
          ) : (
            weeklyGoals.map(goal => (
              <div key={goal.id} className="flex items-center gap-3 group">
                <button 
                  onClick={() => onToggleGoal(goal.id)}
                  className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${
                    goal.completed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
                  }`}
                >
                  {goal.completed && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
                <span className={`text-sm flex-1 ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {goal.text}
                </span>
                <button 
                  onClick={() => onDeleteGoal(goal.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Daily Activities Section */}
      {categories.map(cat => (
        <section key={cat} className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{cat}</h3>
          <div className="grid gap-3">
            {activities.filter(a => a.category === cat).map(activity => (
              <div 
                key={activity.id} 
                onClick={() => onToggle(activity.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                  activity.completed 
                    ? 'bg-emerald-50 border-emerald-100 opacity-60' 
                    : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  activity.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                }`}>
                  {activity.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </div>
                <div>
                  <h4 className={`font-bold ${activity.completed ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>
                    {activity.title}
                  </h4>
                  <p className="text-sm text-slate-500">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Personal Self-Care Reflections</h3>
        <div className="space-y-4">
          <textarea 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            placeholder="What's one thing you want to do for yourself tomorrow?"
            rows={3}
          ></textarea>
          <button className="px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors">
            Save Reflection
          </button>
        </div>
      </section>
    </div>
  );
};

export default Activities;
