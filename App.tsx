
import React, { useState, useEffect } from 'react';
import { AppView, MoodEntry, Activity, WeeklyGoal } from './types';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import Activities from './components/Activities';
import Resources from './components/Resources';
import ImageAnalyzer from './components/ImageAnalyzer';
import Login from './components/Login';

// Lucide Icons components (simplified since we can't import the library directly in this environment, we'll use SVGs)
const Icons = {
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Chat: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
  Activities: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/></svg>,
  Resources: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14M16.5 9.4 7.55 4.24"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>,
  Analyze: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', title: '5-Minute Box Breathing', description: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s.', category: 'Mindfulness', completed: false },
    { id: '2', title: 'List 3 Successes', description: 'Write down 3 things you did well today, no matter how small.', category: 'Academic', completed: false },
    { id: '3', title: 'Short Walk', description: 'Step outside for 10 minutes of fresh air.', category: 'Physical', completed: false },
  ]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);

  // Load state from local storage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('isLoggedIn');
    if (savedAuth === 'true') setIsAuthenticated(true);

    const savedMoods = localStorage.getItem('moods');
    const savedActivities = localStorage.getItem('activities');
    const savedGoals = localStorage.getItem('weeklyGoals');
    if (savedMoods) setMoods(JSON.parse(savedMoods));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    if (savedGoals) setWeeklyGoals(JSON.parse(savedGoals));
  }, []);

  // Save state to local storage when it changes
  useEffect(() => {
    localStorage.setItem('moods', JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('weeklyGoals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
  };

  const addMood = (mood: number, stress: number) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      stress
    };
    setMoods(prev => [newEntry, ...prev].slice(0, 30)); // Keep last 30 days
  };

  const toggleActivity = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const addWeeklyGoal = (text: string) => {
    const newGoal: WeeklyGoal = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    setWeeklyGoals(prev => [...prev, newGoal]);
  };

  const toggleWeeklyGoal = (id: string) => {
    setWeeklyGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteWeeklyGoal = (id: string) => {
    setWeeklyGoals(prev => prev.filter(g => g.id !== id));
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-xl overflow-hidden md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-indigo-600 text-white">
        <h1 className="text-xl font-bold tracking-tight">MindfulCampus</h1>
        <div className="flex gap-2">
          <button onClick={() => setCurrentView(AppView.CHAT)} className="p-2 bg-indigo-500 rounded-full">
            <Icons.Chat />
          </button>
        </div>
      </header>

      {/* Navigation Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <nav className="flex md:flex-col order-last md:order-first bg-slate-50 border-t md:border-t-0 md:border-r border-slate-200 p-2 md:w-20 lg:w-64">
        <div className="hidden lg:block p-6 mb-4">
          <h1 className="text-2xl font-bold text-indigo-600">MindfulCampus</h1>
          <p className="text-sm text-slate-500">Your AI Wellness Companion</p>
        </div>
        
        <div className="flex md:flex-col w-full justify-around md:justify-start gap-1">
          <NavItem active={currentView === AppView.DASHBOARD} onClick={() => setCurrentView(AppView.DASHBOARD)} icon={<Icons.Dashboard />} label="Dashboard" />
          <NavItem active={currentView === AppView.CHAT} onClick={() => setCurrentView(AppView.CHAT)} icon={<Icons.Chat />} label="AI Listener" />
          <NavItem active={currentView === AppView.ACTIVITIES} onClick={() => setCurrentView(AppView.ACTIVITIES)} icon={<Icons.Activities />} label="Activities" />
          <NavItem active={currentView === AppView.RESOURCES} onClick={() => setCurrentView(AppView.RESOURCES)} icon={<Icons.Resources />} label="Resources" />
          <NavItem active={currentView === AppView.ANALYZE} onClick={() => setCurrentView(AppView.ANALYZE)} icon={<Icons.Analyze />} label="Analyze" />
          
          <button 
            onClick={handleLogout}
            className="hidden lg:flex mt-auto items-center gap-3 p-3 lg:px-6 lg:py-4 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
        {currentView === AppView.DASHBOARD && <Dashboard moods={moods} onAddMood={addMood} activities={activities} />}
        {currentView === AppView.CHAT && <ChatInterface />}
        {currentView === AppView.ACTIVITIES && (
          <Activities 
            activities={activities} 
            onToggle={toggleActivity} 
            weeklyGoals={weeklyGoals}
            onAddGoal={addWeeklyGoal}
            onToggleGoal={toggleWeeklyGoal}
            onDeleteGoal={deleteWeeklyGoal}
          />
        )}
        {currentView === AppView.RESOURCES && <Resources />}
        {currentView === AppView.ANALYZE && <ImageAnalyzer />}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-3 p-3 lg:px-6 lg:py-4 rounded-xl transition-all duration-200 ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-200'
    }`}
  >
    {icon}
    <span className="text-[10px] lg:text-base font-medium">{label}</span>
  </button>
);

export default App;
