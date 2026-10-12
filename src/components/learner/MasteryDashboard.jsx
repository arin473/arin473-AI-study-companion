import React from 'react';
import { 
  TrendingUp, 
  BrainCircuit, 
  Sparkles, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Flame,
  Target,
  BarChart2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../services/storageService';
import { getActiveSubject, getActiveSubjectTopics } from '../../services/subjectService';

export default function MasteryDashboard({ 
  activeCourse,
  selectedSource,
  overallMastery, 
  isDiagnosticDone, 
  onOpenDiagnostic, 
  onStartQuiz, 
  onGoToTutor, 
  onGoToRevision 
}) {
  const { t, translateTopic } = useLanguage();
  const studyStreakDays = StorageService.getStudyStreakDays();
  const activeSubject = getActiveSubject(selectedSource, activeCourse);
  const rawTopics = getActiveSubjectTopics(selectedSource, activeCourse);
  const topics = rawTopics.map(translateTopic);
  
  // Find weakest and strongest topics
  const sortedTopics = [...topics].sort((a, b) => a.mastery - b.mastery);
  const weakestTopic = sortedTopics[0];
  const strongestTopic = sortedTopics[sortedTopics.length - 1];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-blue-950/60 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              {t('bktActiveBadge')}
            </span>
            <span className="text-xs text-slate-400">{t('trackDReq4')}</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t('dashboardTitle')}
          </h2>

          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {t('dashboardDesc')}
          </p>
        </div>

        {/* Diagnostic Calibration CTA */}
        {!isDiagnosticDone ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2 shrink-0 max-w-xs text-left">
            <div className="font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t('initCalibNeeded')}
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              {t('initCalibDesc')}
            </p>
            <button
              onClick={onOpenDiagnostic}
              className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
            >
              {t('startDiagnosticBtn')}
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div className="text-left text-xs">
              <div className="font-bold text-white">{t('diagnosticCalibrated')}</div>
              <div className="text-[11px] text-emerald-400">{t('priorProbInit')}</div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Overall Mastery */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('overallBktMastery')}
            </span>
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{overallMastery}%</span>
            <span className="text-xs text-emerald-400 font-semibold">{t('thisWeekGain')}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${overallMastery}%` }} />
          </div>
        </div>

        {/* Card 2: Highest Mastery Topic */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('strongestConcept')}
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="font-semibold text-sm text-slate-100 truncate">
            {strongestTopic?.title || 'RPC & State Machines'}
          </div>
          <div className="text-xs text-slate-400">
            {t('retention')}: <span className="text-emerald-400 font-bold">{Math.round((strongestTopic?.mastery || 0.8) * 100)}%</span> ({t('safeFromForgetting')})
          </div>
        </div>

        {/* Card 3: Targeted Weak Topic */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('targetedWeakTopic')}
            </span>
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="font-semibold text-sm text-slate-100 truncate">
            {weakestTopic?.title || 'Byzantine Fault Tolerance'}
          </div>
          <div className="text-xs text-slate-400">
            {t('retention')}: <span className="text-amber-400 font-bold">{Math.round((weakestTopic?.mastery || 0.35) * 100)}%</span> ({t('needsReview')})
          </div>
        </div>

        {/* Card 4: Study Time & Streak */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('activeFocusStreak')}
            </span>
            <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{studyStreakDays} {t('days')}</span>
            <span className="text-xs text-slate-400">{t('totalStudyHours')}</span>
          </div>
          <div className="text-xs text-indigo-400 font-semibold">
            {t('nextExamTarget')}
          </div>
        </div>

      </div>

      {/* Main Grid: Topic Mastery Breakdown + Adaptive Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Topic Mastery Breakdown */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                {t('perTopicMastery')}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{t('updatedLive')}</span>
          </div>

          <div className="space-y-4 pt-2">
            {topics.map((topic) => {
              const pct = Math.round(topic.mastery * 100);
              const isHigh = pct >= 70;
              const isMed = pct >= 40 && pct < 70;

              return (
                <div key={topic.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-200">{topic.title}</span>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{topic.description}</div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className={`font-mono font-bold text-sm ${isHigh ? 'text-emerald-400' : isMed ? 'text-indigo-400' : 'text-amber-400'}`}>
                        {pct}%
                      </span>
                      <div className="text-[10px] text-slate-500 uppercase">{topic.difficulty}</div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isHigh ? 'bg-emerald-400' : isMed ? 'bg-indigo-500' : 'bg-amber-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Adaptive Recommendation Engine */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                {t('adaptiveNextAction')}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t('needsReview')}: <span className="font-bold text-amber-300">{weakestTopic?.title}</span>
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-slate-200">{t('recommendedSteps')}</div>
              <ul className="space-y-1.5 text-slate-400 text-[11px] list-disc list-inside">
                <li>Review the core invariants of {weakestTopic?.title || 'your weakest topic'}</li>
                <li>Complete practice questions on {weakestTopic?.title || 'the weakest topic'} in Adaptive Assessments</li>
                <li>Reinforce retention with spaced-repetition flashcards</li>
              </ul>
              {onGoToTutor && (
                <button
                  onClick={() => onGoToTutor(`Explain the core invariants of ${weakestTopic?.title || 'my weakest topic'} with a concrete example`)}
                  className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white text-[11px] font-semibold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Tutor about {weakestTopic?.title || 'this topic'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onStartQuiz()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>{t('launchPracticeBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToRevision}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <span>{t('reviewFlashcardsBtn')}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
