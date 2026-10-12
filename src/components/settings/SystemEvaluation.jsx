import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ExternalLink,
  Award,
  Zap,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { EVALUATION_METRICS } from '../../data/mockEvaluation';
import { getActiveSubject } from '../../services/subjectService';
import { runBenchmarkEvaluation } from '../../services/benchmarkService';
import { GeminiService } from '../../services/geminiService';

export default function SystemEvaluation({ activeCourse, selectedSource }) {
  const [activeTab, setActiveTab] = useState('metrics');
  const [isRunning, setIsRunning] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [error, setError] = useState(null);
  const activeSubject = getActiveSubject(selectedSource, activeCourse);
  
  // Use real benchmark results if available, otherwise fall back to mock data
  const metrics = benchmarkResults?.metrics || EVALUATION_METRICS.metrics;
  const simulatedProfiles = EVALUATION_METRICS.simulatedProfiles;
  const benchmarkTestCases = benchmarkResults?.benchmarkTestCases || EVALUATION_METRICS.benchmarkTestCases;
  const framework = benchmarkResults?.framework || EVALUATION_METRICS.framework;
  const testSetSize = benchmarkResults?.testSetSize || EVALUATION_METRICS.testSetSize;
  const evaluatedAt = benchmarkResults?.evaluatedAt;
  const allPassed = benchmarkResults?.allPassed;

  const runBenchmark = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    try {
      const results = await runBenchmarkEvaluation(
        selectedSource,
        activeCourse,
        (params) => GeminiService.askTutor(params)
      );
      setBenchmarkResults(results);
    } catch (err) {
      setError(err.message || 'Benchmark evaluation failed');
    } finally {
      setIsRunning(false);
    }
  }, [selectedSource, activeCourse]);

  // Auto-run benchmark when the active subject changes
  useEffect(() => {
    setBenchmarkResults(null);
    runBenchmark();
  }, [selectedSource?.id, activeCourse?.id]);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Automated Pipeline Benchmarking
            </span>
            <span className="text-xs text-slate-400">Track D Requirement 5</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            System Evaluation & Framework Benchmarks
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Standardized retrieval & generation pipeline evaluation using <span className="text-indigo-300 font-semibold">{framework}</span>. Measured across {testSetSize} source-backed questions, out-of-scope queries, and multi-session simulated student runs.
          </p>
          {benchmarkResults?.subjectTitle && (
            <p className="text-xs text-indigo-300">
              Active Subject: <span className="font-semibold">{benchmarkResults.subjectTitle}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Benchmark'}</span>
          </button>
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl shrink-0 text-xs">
            <Award className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="font-bold text-white">
                {isRunning ? 'Evaluating...' : allPassed === true ? 'All Benchmarks Passed' : allPassed === false ? 'Some Benchmarks Failed' : 'Ready to Evaluate'}
              </div>
              <div className={`text-[11px] font-medium ${allPassed === true ? 'text-emerald-400' : allPassed === false ? 'text-amber-400' : 'text-slate-400'}`}>
                {isRunning ? 'Running evaluation...' : allPassed === true ? `Faithfulness: ${Math.round(metrics.faithfulness.score * 100)}%` : allPassed === false ? 'Review required' : 'Click Run Benchmark to evaluate'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Benchmark Error:</span> {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isRunning && (
        <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-300">Running benchmark evaluation against active subject...</p>
          <p className="text-xs text-slate-500">This may take 30-60 seconds as it evaluates multiple test queries</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'metrics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          RAGAS Metrics (Retrieval & Generation)
        </button>

        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'profiles'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Simulated Student Multi-Session Profiles
        </button>

        <button
          onClick={() => setActiveTab('testcases')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'testcases'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Adversarial & Grounded Test Cases
        </button>
      </div>

      {/* Tab 1: RAGAS Metrics */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(metrics).map(([key, m]) => {
            const pct = Math.round(m.score * 100);
            const targetPct = Math.round(m.target * 100);
            const passed = m.status === 'Passed';

            return (
              <div key={key} className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      passed 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-white">{pct}%</span>
                    <span className="text-xs text-slate-500">Target: {targetPct}%</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      passed ? 'bg-gradient-to-r from-indigo-500 to-emerald-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Simulated Student Profiles */}
      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {simulatedProfiles.map((p) => (
            <div key={p.id} className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">{p.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Sessions Run: {p.sessionsRun}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Diagnostic Intake:</span>
                  <span className="font-bold text-slate-200">{p.initialDiagnosticScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mastery Gain:</span>
                  <span className="font-bold text-emerald-400">{p.masteryGain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Final Post-Test:</span>
                  <span className="font-bold text-indigo-300">{p.finalMastery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Question Repetition Rate:</span>
                  <span className="font-mono text-slate-300">{p.questionRepetitionRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Retention Score:</span>
                  <span className="font-bold text-emerald-300">{p.retentionScore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Benchmark Test Cases */}
      {activeTab === 'testcases' && (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Per-Case Diagnostics — Query, Retrieved Context, Generated Answer, Ground Truth & Scores
          </div>
          <div className="text-xs text-slate-400">
            Each in-scope case evaluates against the ACTIVE subject's FULL indexed material (all citations + topic content). Pass requires Faithfulness ≥ 85% AND Relevancy ≥ 80% AND Context Recall ≥ 85% AND Precision ≥ 85%.
          </div>

          {benchmarkTestCases.map((tc, i) => {
            const isOutScope = tc.query.includes('cryptocurrency') || tc.query.includes('cookie');
            const scores = [
              { label: 'Faithfulness', value: tc.faithfulness, target: 0.85, ok: tc.faithfulness >= 0.85 },
              { label: 'Answer Relevancy', value: tc.answerRelevancy, target: 0.80, ok: tc.answerRelevancy >= 0.80 },
              { label: 'Context Recall', value: tc.contextRecall, target: 0.85, ok: tc.contextRecall >= 0.85 },
              { label: 'Context Precision', value: tc.contextPrecision, target: 0.85, ok: tc.contextPrecision >= 0.85 }
            ];

            return (
              <div key={i} className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tc.passed
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {tc.passed ? 'PASS' : 'FAIL'}{isOutScope ? ' (OUT-OF-SCOPE REFUSAL TEST)' : ''}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{tc.id}</span>
                    </div>
                    <div className="font-semibold text-slate-100 text-sm mb-1">
                      Query: "{tc.query}"
                    </div>
                    <div className="text-[11px] text-slate-400 mb-1">
                      <span className="font-medium text-slate-300">Expected:</span> {tc.expectedOutcome}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <span className="font-medium text-slate-300">Model Output:</span> {tc.modelOutputStatus}
                    </div>
                  </div>
                  <div className="w-24 shrink-0 space-y-1">
                    {scores.map((s, j) => (
                      <div key={j} className="text-[10px]">
                        <span className="text-slate-400">{s.label}:</span>{' '}
                        <span className={`font-bold ${s.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                          {Math.round(s.value * 100)}%
                        </span>{' '}
                        <span className="text-slate-600">({s.target * 100}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {!isOutScope && (
                  <>
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Generated Answer ({(tc.rawResponse || '').length} chars)
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] leading-relaxed font-mono max-h-40 overflow-y-auto text-slate-300">
                        {tc.rawResponse || 'No response generated.'}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Required Topic Material (Ground Truth — what the answer must retrieve)
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] leading-relaxed font-mono max-h-40 overflow-y-auto text-slate-300">
                        {tc.groundTruth?.requiredTopicMaterial || '—'}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Retrieved Source Excerpts (what retrieval surfaced for this question)
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] leading-relaxed font-mono max-h-40 overflow-y-auto text-slate-300">
                        {tc.groundTruth?.relevantExcerpts || '—'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {benchmarkResults?.debug && (
            <div className="glass-panel border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-200">Benchmark Run Summary</div>
              <div className="text-[11px] text-slate-400">
                In-scope cases: {benchmarkResults.debug.inScopeCount} | Out-of-scope (refusal) cases:{' '}
                {benchmarkResults.debug.outOfScopeCount}
              </div>
              <div className="text-[11px] text-slate-400">
                Test set size: {benchmarkResults.testSetSize} | Framework:{' '}
                {benchmarkResults.framework} | Evaluated at:{' '}
                {new Date(benchmarkResults.evaluatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
