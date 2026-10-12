import React, { useState } from 'react';
import { 
  Key, 
  Sparkles, 
  ShieldCheck, 
  Languages, 
  Bot, 
  CheckCircle2, 
  ExternalLink, 
  RotateCcw,
  Zap,
  Save
} from 'lucide-react';

export default function SystemSettings({ settings, onSaveSettings, onResetAll }) {
  const [formData, setFormData] = useState({
    geminiApiKey: settings?.geminiApiKey || '',
    geminiModel: settings?.geminiModel || 'gemini-1.5-flash',
    strictGrounding: settings?.strictGrounding ?? true,
    tutorPersona: settings?.tutorPersona || 'academic',
    language: settings?.language || 'en',
    enableVoiceAudio: settings?.enableVoiceAudio ?? true
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/20 shadow-xl flex items-center justify-between">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            System Preferences
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1.5">
            Model Configuration & API Integration
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Connect live Google Gemini API endpoints, adjust grounding strictness, and tune companion persona.
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="glass-panel border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Gemini API Key */}
        <div className="space-y-3 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Google Gemini API Key</span>
            </label>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
            >
              <span>Get API Key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <input 
            type="password"
            placeholder="Paste your Gemini API key (AIzaSy...)"
            value={formData.geminiApiKey}
            onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:outline-none text-xs text-slate-100 font-mono shadow-inner"
          />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Note: When no API key is set, the application operates in <strong>Grounded Core Mode</strong> with comprehensive, pre-extracted MIT 6.824 & Stanford CS224N course citations and Bayesian Knowledge Tracing.
          </p>
        </div>

        {/* Model & Language Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Gemini Model Provider:</span>
            </label>
            <select
              value={formData.geminiModel}
              onChange={(e) => setFormData({ ...formData, geminiModel: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended - Ultra Fast)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Multimodal Reasoning)</option>
              <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Next-Gen)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-purple-400" />
              <span>Language Preference:</span>
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="en">English (Standard Academic)</option>
              <option value="hinglish">Hinglish (Conversational Bilingual)</option>
              <option value="hi">हिन्दी (Hindi Tutoring)</option>
            </select>
          </div>

        </div>

        {/* Persona & Guardrail Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>AI Tutor Pedagogical Style:</span>
            </label>
            <select
              value={formData.tutorPersona}
              onChange={(e) => setFormData({ ...formData, tutorPersona: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="academic">Academic & Rigorous (Direct Proofs)</option>
              <option value="socratic">Socratic (Guides with Thought-Provoking Questions)</option>
              <option value="eli5">Intuitive / Visual (Simplifies with Real-world Analogies)</option>
            </select>
          </div>

          {/* Strict Grounding Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-200">Strict Syllabus Grounding</div>
              <div className="text-[10px] text-slate-400">Refuse out-of-scope queries</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                checked={formData.strictGrounding} 
                onChange={(e) => setFormData({ ...formData, strictGrounding: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Cache & History</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Settings Saved!' : 'Save System Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
