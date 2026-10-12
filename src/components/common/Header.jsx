import React, { useState } from 'react';
import { 
  GraduationCap, 
  Layers, 
  Languages, 
  BrainCircuit, 
  Settings as SettingsIcon,
  ChevronDown,
  Activity,
  Check,
  FileText
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Header({ 
  courses, 
  activeCourse, 
  selectedSource,
  onSelectCourse, 
  onSelectSource,
  masteryPercentage, 
  isDiagnosticDone, 
  onOpenDiagnostic, 
  onOpenSetup, 
  settings
}) {
  const { language, setLanguage, t, isHindi } = useLanguage();
  const hasApiKey = Boolean(settings?.geminiApiKey);
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Brand & Course Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                  {t('appTitle')}
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t('trackDBadge')}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-800 hidden md:block" />

          {/* Course Selector Dropdown (click-to-toggle: works on touch & keyboard) */}
          <div className="relative">
            <div
              role="button"
              tabIndex={0}
              aria-expanded={isCourseMenuOpen}
              onClick={() => setIsCourseMenuOpen(o => !o)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsCourseMenuOpen(o => !o); }}
              className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/70 hover:border-indigo-500/50 rounded-lg px-3 py-1.5 cursor-pointer transition-all shadow-inner"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  {t('activeSubject')}
                </span>
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[160px] sm:max-w-[220px]">
                  {selectedSource ? selectedSource.title : (activeCourse?.title || 'Select Course')}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ml-1 transition-transform ${isCourseMenuOpen ? 'rotate-180 text-indigo-400' : ''}`} />
            </div>

            {/* Click-away layer */}
            {isCourseMenuOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsCourseMenuOpen(false)} />
            )}

            {/* Dropdown Menu */}
            {isCourseMenuOpen && (
              <div className="absolute left-0 mt-1 w-72 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  {t('switchKnowledgeBase')}
                </div>
                {courses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { onSelectCourse(c.id); setIsCourseMenuOpen(false); }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all text-xs ${
                      c.id === activeCourse?.id && !selectedSource
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-white font-medium'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                      {c.code}
                    </span>
                    <div className="flex-1 truncate">
                      <div className="font-semibold truncate">{c.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{c.instructor}</div>
                    </div>
                  </button>
                ))}

                {/* Active Course Sources */}
                {activeCourse?.sources && activeCourse.sources.length > 0 && (
                  <>
                    <div className="text-[11px] font-semibold text-slate-400 px-2 pt-2.5 pb-1 uppercase tracking-wider border-t border-slate-800 mt-1">
                      {t('filterSources') || 'Course Sources'}
                    </div>
                    {activeCourse.sources.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { onSelectSource && onSelectSource(s); setIsCourseMenuOpen(false); }}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between gap-2 transition-all text-xs ${
                          selectedSource?.id === s.id
                            ? 'bg-indigo-600/20 border border-indigo-500/40 text-white font-medium'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">{s.title}</span>
                        </div>
                        {selectedSource?.id === s.id && (
                          <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Mastery Pill, Diagnostic Button, Language & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Diagnostic Intake Status */}
          <button
            onClick={onOpenDiagnostic}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isDiagnosticDone
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>{isDiagnosticDone ? t('diagnosticCalibrated') : t('intakeDiagnostic')}</span>
          </button>

          {/* Bayesian Mastery Indicator */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 shadow-inner">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                {t('bktMastery')}
              </span>
              <span className="text-xs font-bold text-indigo-300 leading-tight">
                {masteryPercentage}%
              </span>
            </div>
          </div>

          {/* Language Selector (English / हिन्दी / Hinglish) — click-to-toggle */}
          <div className="relative">
            <button
              aria-expanded={isLangMenuOpen}
              onClick={() => setIsLangMenuOpen(o => !o)}
              className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 transition-colors shadow-sm"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium">
                {language === 'hi' ? 'हिन्दी (HI)' : language === 'hinglish' ? 'Hinglish' : 'English (EN)'}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangMenuOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
            )}
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in duration-150">
                <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">
                  Select Language
                </div>
                <button
                  onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${language === 'en' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <span>English (US/UK)</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${language === 'hi' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { setLanguage('hinglish'); setIsLangMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${language === 'hinglish' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <span>Hinglish (Bilingual)</span>
                  {language === 'hinglish' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Model Status Pill */}
          <div 
            onClick={onOpenSetup}
            className={`cursor-pointer px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition-all ${
              hasApiKey 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`} />
            <span className="hidden sm:inline">{hasApiKey ? t('geminiLive') : t('groundedCore')}</span>
            <SettingsIcon className="w-3 h-3 ml-0.5 opacity-70" />
          </div>

        </div>

      </div>
    </header>
  );
}
