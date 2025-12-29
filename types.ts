
export enum AppView {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  ACTIVITIES = 'activities',
  RESOURCES = 'resources',
  ANALYZE = 'analyze'
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5
  stress: number; // 1-5
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  type?: 'thinking' | 'standard';
  image?: string;
  audio?: string;
  groundingLinks?: Array<{ title: string; uri: string }>;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'Mindfulness' | 'Academic' | 'Social' | 'Physical';
  completed: boolean;
}

export interface WeeklyGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface SelfCarePlan {
  dailyGoals: string[];
  reflections: string;
}
