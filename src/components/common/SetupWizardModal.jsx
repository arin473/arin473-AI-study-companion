import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Key, 
  ShieldCheck, 
  Languages, 
  Bot, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function SetupWizardModal({ isOpen, onClose, settings, onSaveSettings, courses, activeCourseId, onSelectCourse }) {
  const { setLanguage } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const closeTimerRef = useRef(null);

  const [formData, setFormData] = useState({
    geminiApiKey: settings?.geminiApiKey || '',
    geminiModel: settings?.geminiModel || 'gemini-1.5-flash',
    strictGrounding: settings?.strictGrounding ?? true,
    tutorPersona: settings?.tutorPersona || 'academic',
    language: settings?.language || 'en',
    courseId: activeCourseId || courses[0]?.id
  });

  // Re-sync the form every time the wizard is (re)opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        geminiApiKey: settings?.geminiApiKey || '',
        geminiModel: settings?.geminiModel || 'gemini-1.5-flash',
        strictGrounding: settings?.strictGrounding ?? true,
        tutorPersona: settings?.tutorPersona || 'academic',
        language: settings?.language || 'en',
        courseId: activeCourseId || courses[0]?.id
      });
      setIsSaved(false);
    }
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen, settings, activeCourseId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    // Keep the global UI language in sync with the saved preference
    if (formData.language) setLanguage(formData.language);
    if (formData.courseId !== activeCourseId) {
      onSelectCourse(formData.courseId);
    }
    setIsSaved(true);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                Setup Configuration
              </span>
              <h3 className="font-semibold text-sm text-slate-100">
                AI Study Companion System Setup
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Section 1: Active Course */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Select Active Course Knowledge Base</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.map((c) => {
                const isSelected = formData.courseId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setFormData({ ...formData, courseId: c.id })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                        {c.code}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div className="font-semibold text-xs text-slate-100 line-clamp-1">{c.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{c.instructor}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Gemini API Integration */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Google Gemini API Key (Live Model Integration)</span>
              </label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input 
              type="password"
              placeholder="Paste your Gemini API key (AIzaSy...)"
              value={formData.geminiApiKey}
              onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-indigo-500 focus:outline-none text-xs text-slate-100 font-mono"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Optional: If left blank, the app will seamlessly run using the pre-indexed source-grounded knowledge base engine with exact textbook, slide, and lecture citations.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Model Engine</label>
                <select 
                  value={formData.geminiModel}
                  onChange={(e) => setFormData({ ...formData, geminiModel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, Low Latency)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Multimodal Reasoning)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Language Preference</label>
                <select 
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
                >
                  <option value="en">English</option>
                  <option value="hinglish">Hinglish (Hindi + English)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Grounding Guardrails + Tutor Persona */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Strict Source Grounding Guardrails</div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    Refuse or flag queries not covered by the uploaded materials.
                  </div>
                </div>
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

            <div className="space-y-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>AI Tutor Teaching Style</span>
              </label>
              <select
                value={formData.tutorPersona}
                onChange={(e) => setFormData({ ...formData, tutorPersona: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
              >
                <option value="academic">Academic & Rigorous (Direct Proofs)</option>
                <option value="socratic">Socratic (Guides with Questions)</option>
                <option value="eli5">Intuitive / Visual (Analogies)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSaved ? 'Settings Saved!' : 'Apply Setup & Start'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
