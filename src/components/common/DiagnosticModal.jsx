import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  TrendingUp 
} from 'lucide-react';

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'diag-1',
    topicId: 'topic-rpc-state',
    topicName: 'RPC & Replicated State Machines',
    question: 'What does "at-most-once" RPC semantics guarantee when network packets are duplicated?',
    options: [
      'The server executes the remote call exactly zero or one time, ignoring duplicate executions.',
      'The client re-sends the request indefinitely until the server crashes.',
      'All servers in the cluster reboot immediately.',
      'Messages are automatically converted to UDP packets.'
    ],
    correctAnswer: 0
  },
  {
    id: 'diag-2',
    topicId: 'topic-raft-consensus',
    topicName: 'Raft Consensus Protocol',
    question: 'What is the primary role of heartbeat RPCs sent from a Raft leader to followers?',
    options: [
      'To reset follower election timers and maintain leader authority without triggering elections.',
      'To shut down idle worker threads.',
      'To benchmark network round-trip latency for billing.',
      'To change the cluster cryptographic public key.'
    ],
    correctAnswer: 0
  },
  {
    id: 'diag-3',
    topicId: 'topic-vector-clocks',
    topicName: 'Logical Clocks & Causality',
    question: 'If Event A happened before Event B (A -> B), what is true of their Lamport timestamps L(A) and L(B)?',
    options: [
      'L(A) < L(B)',
      'L(A) == L(B)',
      'L(A) > L(B)',
      'Lamport clocks cannot determine this relation.'
    ],
    correctAnswer: 0
  }
];

export default function DiagnosticModal({ isOpen, onClose, onCompleteDiagnostic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  // Reset the intake flow every time the modal is (re)opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setSelectedAnswers({});
      setIsCompleted(false);
      setCalculatedScore(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIndex];

  const handleSelectAnswer = (optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Complete diagnostic
      let correctCount = 0;
      DIAGNOSTIC_QUESTIONS.forEach((q, i) => {
        if (selectedAnswers[i] === q.correctAnswer) {
          correctCount++;
        }
      });
      const scorePct = Math.round((correctCount / DIAGNOSTIC_QUESTIONS.length) * 100);
      setCalculatedScore(scorePct);
      setIsCompleted(true);
      if (onCompleteDiagnostic) {
        onCompleteDiagnostic({
          score: scorePct,
          baselineMastery: Math.max(0.3, Number((scorePct / 100).toFixed(2)))
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
                New Learner Onboarding
              </span>
              <h3 className="font-semibold text-sm text-slate-100">
                Diagnostic Intake Assessment
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <div className="p-6 space-y-6">
            
            {/* Progress indicators */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Question {currentIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
              <span className="text-indigo-400 font-medium">{currentQ.topicName}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h4 className="text-base font-medium text-slate-100 leading-snug">
              {currentQ.question}
            </h4>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <div className="pt-2 flex justify-end">
              <button
                disabled={selectedAnswers[currentIndex] === undefined}
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>{currentIndex < DIAGNOSTIC_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Calibration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Result View */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                Learner Profile Calibrated
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Baseline Mastery: {calculatedScore}%
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                Your Bayesian Knowledge Tracing prior probabilities have been initialized. The AI Tutor and Adaptive Assessments are now tuned to your skill level.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Adaptive Recommendation:
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {calculatedScore >= 66
                  ? 'Strong foundational understanding. Recommended to start with Advanced Byzantine Fault Tolerance and CAP Theorem tradeoffs.'
                  : 'Start with Raft Leader Election timeouts and RPC at-most-once state machine transitions to build solid mastery.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Continue to Study Companion
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
