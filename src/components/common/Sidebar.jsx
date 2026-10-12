import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  Headphones, 
  FileCheck2, 
  GitFork, 
  Sparkles, 
  BarChart3, 
  Settings,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../services/storageService';

export const NAV_ITEMS = [
  { id: 'dashboard', labelKey: 'navDashboard', defaultLabel: 'Learner Dashboard', icon: LayoutDashboard, badge: 'BKT' },
  { id: 'ingestion', labelKey: 'navIngestion', defaultLabel: 'Multimodal Ingestion', icon: BookOpen, badge: 'Sources' },
  { id: 'tutor', labelKey: 'navTutor', defaultLabel: 'Grounded AI Tutor', icon: MessageSquare, badge: 'Cited' },
  { id: 'audio-session', labelKey: 'navAudio', defaultLabel: 'Audio Tutor Room', icon: Headphones, badge: 'Live' },
  { id: 'assessments', labelKey: 'navAssessments', defaultLabel: 'Adaptive Assessments', icon: FileCheck2, badge: 'Exam' },
  { id: 'flowmap', labelKey: 'navFlowMap', defaultLabel: 'Visual Course Flow', icon: GitFork, badge: 'Map' },
  { id: 'revision', labelKey: 'navRevision', defaultLabel: 'Targeted Revision', icon: Sparkles, badge: 'SR' },
  { id: 'evaluation', labelKey: 'navEvaluation', defaultLabel: 'System Benchmarks', icon: BarChart3, badge: 'RAGAS' },
  { id: 'settings', labelKey: 'navSettings', defaultLabel: 'Setup & Model Config', icon: Settings }
];

export default function Sidebar({ activeTab, onSelectTab, activeCourse, overallMastery, isDiagnosticDone }) {
  const { t } = useLanguage();
  const studyStreakDays = StorageService.getStudyStreakDays();

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 flex flex-col justify-between shrink-0 hidden md:flex h-[calc(100vh-65px)] sticky top-[65px]">
      {/* Top Nav Items */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t('navigationModules')}
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = t(item.labelKey);

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="truncate">{label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-indigo-300 border border-slate-700/60'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/20 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              {t('activeStreak')}: {studyStreakDays} {t('days')}
            </span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold">
              {overallMastery}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${overallMastery}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              {isDiagnosticDone ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3 h-3 text-amber-400" />
              )}
              {isDiagnosticDone ? t('modelTuned') : t('diagnosticPending')}
            </span>
            <span className="text-[10px] text-slate-500">
              {activeCourse?.code || 'CS-6824'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
