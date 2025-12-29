
import React, { useState } from 'react';
import { getGeminiAI } from '../services/geminiService';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'sentiment'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentimentText, setSentimentText] = useState('');
  const [sentimentResult, setSentimentResult] = useState<'positive' | 'negative' | null>(null);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('sentiment');
    }, 1000);
  };

  const handleSentimentCheck = async () => {
    if (!sentimentText.trim()) return;
    setLoading(true);
    try {
      const ai = getGeminiAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `Analyze the following student's response about how they are feeling. Determine if the sentiment is overall 'positive' or 'negative'. Return only the word 'positive' or 'negative'. Text: "${sentimentText}"` }] }],
      });
      
      const result = response.text?.toLowerCase().includes('positive') ? 'positive' : 'negative';
      setSentimentResult(result);
      
      // Delay to show result before entering app
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    } catch (err) {
      console.error(err);
      onLoginSuccess(); // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-indigo-600">MindfulCampus</h1>
          <p className="text-slate-500 text-sm font-medium">Your safe space for mental well-being</p>
        </div>

        {step === 'phone' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+1</span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="000-000-0000"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-lg font-medium"
                />
              </div>
            </div>
            <button 
              onClick={handleSendOtp}
              disabled={phone.length < 10 || loading}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Send OTP Code"}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2 text-center">
              <label className="text-sm font-bold text-slate-700">Enter Verification Code</label>
              <p className="text-xs text-slate-400">Sent to +1 {phone}</p>
              <input 
                type="text" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-2xl font-black tracking-[1em]"
              />
            </div>
            <button 
              onClick={handleVerifyOtp}
              disabled={otp.length < 4 || loading}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Verify & Continue"}
            </button>
            <button onClick={() => setStep('phone')} className="w-full text-sm font-bold text-indigo-600 hover:underline">Change Phone Number</button>
          </div>
        )}

        {step === 'sentiment' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold text-slate-800">Quick Check-in</h2>
              <p className="text-sm text-slate-500 italic">"How are you feeling at this very moment?"</p>
            </div>
            
            <textarea 
              value={sentimentText}
              onChange={(e) => setSentimentText(e.target.value)}
              placeholder="I'm feeling a bit stressed about finals..."
              rows={4}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-slate-700"
            />

            {sentimentResult && (
              <div className={`p-4 rounded-2xl text-center font-bold animate-bounce ${
                sentimentResult === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {sentimentResult === 'positive' 
                  ? "Glad to hear things are going well! 🌟" 
                  : "I hear you. Let's work on making things better today. ❤️"}
              </div>
            )}

            {!sentimentResult && (
              <button 
                onClick={handleSentimentCheck}
                disabled={!sentimentText.trim() || loading}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
              >
                {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Start My Session"}
              </button>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">Encrypted & Anonymous Support</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
