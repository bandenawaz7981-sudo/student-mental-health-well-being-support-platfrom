
import React, { useState } from 'react';
import * as gemini from '../services/geminiService';

const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'analyze' | 'edit'>('analyze');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const base64 = image.split(',')[1];
      const result = await gemini.analyzeJournalImage(base64);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setAnalysis("I couldn't analyze that image. Please try another one.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = async () => {
    if (!image || !editPrompt.trim()) return;
    setLoading(true);
    setEditedImage(null);
    try {
      const base64 = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const result = await gemini.editImage(base64, editPrompt, mimeType);
      if (result) {
        setEditedImage(result);
      } else {
        alert("Failed to edit image. Try a different prompt.");
      }
    } catch (err) {
      console.error(err);
      alert("Error editing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visual Studio</h2>
          <p className="text-slate-500">Analyze your feelings through images or creatively transform them.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setMode('analyze')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'analyze' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Analyze
          </button>
          <button 
            onClick={() => setMode('edit')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Edit (Nano Banana)
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all ${
            image ? 'border-indigo-600 bg-white' : 'border-slate-200 bg-slate-50'
          }`}>
            {image ? (
              <>
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setImage(null); setAnalysis(null); setEditedImage(null); }} 
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                <p className="text-sm text-slate-400 font-medium">Click to upload photo</p>
                <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </>
            )}
          </div>

          {mode === 'edit' && image && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Edit Instructions</label>
              <textarea 
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g. 'Add a retro filter', 'Make it look like a rainy day', 'Remove the objects on the table'..."
                className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={2}
              />
            </div>
          )}

          <button 
            disabled={!image || loading || (mode === 'edit' && !editPrompt.trim())}
            onClick={mode === 'analyze' ? startAnalysis : startEdit}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/></svg>
                {mode === 'analyze' ? 'Run Analysis' : 'Apply Edit'}
              </>
            )}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {mode === 'analyze' ? "Gemini's Insight" : "Result"}
          </h3>
          
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 py-20">
              <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400 font-medium">{mode === 'analyze' ? 'Analyzing your image...' : 'Generating your edit...'}</p>
            </div>
          ) : mode === 'analyze' ? (
            analysis ? (
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap animate-in fade-in duration-500">
                {analysis}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                <p className="text-sm font-medium text-center">Upload an image and run analysis to get AI insights into your current emotional state.</p>
              </div>
            )
          ) : (
            editedImage ? (
              <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                <img src={editedImage} alt="Edited Result" className="w-full rounded-xl border border-slate-200 shadow-sm" />
                <a 
                  href={editedImage} 
                  download="mindful-edit.png"
                  className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Edited Image
                </a>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                <p className="text-sm font-medium text-center">Upload an image and type instructions to see them come to life using Gemini 2.5 Flash Image.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;
