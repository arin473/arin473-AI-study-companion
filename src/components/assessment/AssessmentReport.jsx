import React from 'react';
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  BookOpen,
  ArrowRight,
  Headphones
} from 'lucide-react';

export default function AssessmentReport({ 
  assessmentSummary, 
  activeCourse, 
  onRetake, 
  onGoToRevision,
  onGoToAudio
}) {
  if (!assessmentSummary) return null;

  const { results = [], timeTakenSeconds = 0, totalQuestions = 0, correctCount = 0, masteryDeltas = {} } = assessmentSummary;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Format time
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Identify weak topics
  const topicMap = {};
  results.forEach(r => {
    if (!topicMap[r.topicId]) {
      topicMap[r.topicId] = { correct: 0, total: 0, wrongExplanations: [] };
    }
    topicMap[r.topicId].total++;
    if (r.isCorrect) {
      topicMap[r.topicId].correct++;
    } else if (r.explanation) {
      topicMap[r.topicId].wrongExplanations.push(r.explanation);
    }
  });

  const weakTopics = Object.keys(topicMap)
    .filter(tid => (topicMap[tid].correct / topicMap[tid].total) < 0.6)
    .map(tid => activeCourse?.topics.find(t => t.id === tid) || { id: tid, title: tid });

  // Ground each weak topic's "misconception" in a real wrong-answer explanation
  const misconceptionFor = (topicId) => {
    const explanations = topicMap[topicId]?.wrongExplanations || [];
    if (explanations.length > 0) {
      const text = explanations[0];
      return `Review focus: ${text.length > 140 ? text.slice(0, 140).trimEnd() + '…' : text}`;
    }
    return 'Practice this topic with the AI tutor to strengthen retention of its core invariants.';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner / Score Summary */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Post-Assessment Analysis Report
            </span>
            <span className="text-xs text-slate-400">Track D Requirement 3c</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Assessment Complete: {scorePercent >= 75 ? 'Mastery Advanced! 🎉' : 'Diagnostics & Gap Identified'}
          </h2>

          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Your responses were processed through Bayesian Knowledge Tracing (BKT) to recalculate latent mastery parameters across all assessed topic nodes.
          </p>
        </div>

        {/* Big Score Ring */}
        <div className="flex items-center gap-6 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl shrink-0">
          <div className="text-center">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-emerald-400">
              {scorePercent}%
            </span>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">
              Final Score
            </div>
          </div>
          <div className="h-10 w-[1px] bg-slate-800" />
          <div className="text-left text-xs space-y-1">
            <div className="text-slate-300">
              Correct: <span className="font-bold text-emerald-400">{correctCount}</span> / {totalQuestions}
            </div>
            <div className="text-slate-400">
              Time: <span className="font-mono text-indigo-300">{formatTime(timeTakenSeconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Weak Topics & Misconceptions Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Identified Weak Topics & Misconceptions */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Diagnosed Weak Topics & Misconceptions
            </h3>
          </div>

          {weakTopics.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                The learner model identified conceptual gaps in the following topics:
              </p>
              {weakTopics.map(topic => (
                <div 
                  key={topic.id}
                  className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5"
                >
                  <div className="font-bold text-amber-300 flex items-center justify-between">
                    <span>{topic.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
                      Needs Targeted Review
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {misconceptionFor(topic.id)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-xs font-bold text-emerald-300">No Critical Misconceptions Detected!</div>
              <p className="text-[11px] text-slate-400">
                You demonstrated strong invariant retention across all evaluated course sections.
              </p>
            </div>
          )}

          {/* Quick Action to Flashcards */}
          <div className="pt-2">
            <button
              onClick={onGoToRevision}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 hover:text-white border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Spaced Repetition Flashcards</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bayesian Knowledge Tracing (BKT) Calibration Shift */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Bayesian Knowledge Tracing Updates
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Per-topic latent probability estimates P(L) updated in real-time using slip rate (S=0.10) and transition rate (T=0.15):
          </p>

          <div className="space-y-3 pt-1">
            {activeCourse?.topics.map((topic) => {
              const currentMasteryPct = Math.round(topic.mastery * 100);
              const isAssessed = topicMap[topic.id];
              const delta = masteryDeltas[topic.id];
              const isImproved = delta != null ? delta > 0 : (isAssessed && (topicMap[topic.id].correct / topicMap[topic.id].total) >= 0.5);

              return (
                <div key={topic.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[200px]">{topic.title}</span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      {delta != null && (
                        <span className={delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-amber-400' : 'text-slate-400'}>
                          {delta > 0 ? '+' : ''}{Math.round(delta * 100)}%
                        </span>
                      )}
                      <span className="font-bold text-indigo-300">{currentMasteryPct}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        currentMasteryPct >= 70 ? 'bg-emerald-400' :
                        currentMasteryPct >= 40 ? 'bg-indigo-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${currentMasteryPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={onRetake}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Scope</span>
            </button>
            <button
              onClick={onGoToAudio}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 hover:text-white border border-purple-500/40 text-purple-300 text-xs font-semibold transition-colors"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Audio Brief</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
