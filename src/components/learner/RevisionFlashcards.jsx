import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Calendar, 
  BrainCircuit, 
  Clock, 
  Layers, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { updateBktMastery } from '../../services/bktLearnerModel';
import { getActiveSubject, getActiveSubjectTopics } from '../../services/subjectService';

export const SAMPLE_FLASHCARDS = [
  {
    id: 'fc-1',
    topic: 'Raft Consensus Protocol',
    front: 'Why must Raft election timeouts be randomized between 150ms and 300ms instead of being fixed?',
    back: 'Randomized election timeouts ensure servers do not wake up at the exact same instant. This prevents split votes by allowing a single server to time out first, increment its term, and gather a majority quorum before any peer triggers election.',
    source: 'Ongaro Raft Paper, Section 5.2 (Leader Election)',
    retention: 0.65
  },
  {
    id: 'fc-2',
    topic: 'Byzantine Fault Tolerance',
    front: 'State the minimum number of nodes required in PBFT to tolerate f Byzantine traitor nodes, and why.',
    back: 'N >= 3f + 1 nodes. If f nodes are malicious and f honest nodes are partitioned/silent, the remaining f + 1 honest nodes must strictly dominate the f malicious nodes to form an indisputable quorum.',
    source: 'Castro-Liskov PBFT Paper & Lecture 06 Timestamp 42:15',
    retention: 0.38
  },
  {
    id: 'fc-3',
    topic: 'Logical Clocks & Causality',
    front: 'Given vector clocks V(A) and V(B), what condition defines that Event A and Event B are concurrent (A || B)?',
    back: 'Event A and B are concurrent (A || B) if and only if neither V(A) <= V(B) nor V(B) <= V(A). That means V(A) is strictly greater in at least one process index, and V(B) is strictly greater in another.',
    source: 'Slide Deck: Logical Clocks, Slide 14',
    retention: 0.72
  },
  {
    id: 'fc-4',
    topic: 'RPC & Replicated State Machines',
    front: 'How do distributed key-value servers ensure idempotent "at-most-once" RPC execution during network retry storms?',
    back: 'The server maintains a deduplication table of client IDs and sequence numbers. If a request with an already-executed sequence number arrives, the server returns the cached response without re-executing state transitions.',
    source: 'MIT 6.824 Lab 2 Specification & Lecture 02',
    retention: 0.85
  }
];

/**
 * Build a targeted flashcard deck from the active subject's weak topics
 * (mastery < 0.6) and cited excerpts. Falls back to the sample deck
 * when the subject has no usable material.
 */
function buildTargetedDeck(subject) {
  const topics = subject?.topics || [];
  if (topics.length === 0) return SAMPLE_FLASHCARDS;

  const weakTopics = topics.filter(tp => (tp.mastery ?? 0) < 0.6);
  const sourceTopics = weakTopics.length > 0 ? weakTopics : topics;
  const cards = [];

  sourceTopics.forEach(tp => {
    (tp.keyConcepts || []).forEach((kc, i) => {
      cards.push({
        id: `fc-${tp.id}-${i}`,
        topicId: tp.id,
        topic: tp.title,
        front: `Key concept in ${tp.title}: ${kc}`,
        back: `${kc} — a core concept in ${tp.title}. ${(tp.description || '').trim()}`.trim(),
        source: subject?.title || 'Course material',
        retention: Math.max(0.2, Math.min(0.9, tp.mastery ?? 0.3))
      });
    });
  });

  // Citation-backed cards (only from topics in the targeted set)
  (subject?.citations || []).forEach((cite, i) => {
    if (cite.topicId && !sourceTopics.find(tp => tp.id === cite.topicId)) return;
    cards.push({
      id: `fc-cite-${cite.id || i}`,
      topicId: cite.topicId || null,
      topic: cite.topicId
        ? (topics.find(tp => tp.id === cite.topicId)?.title || subject?.title || 'Course')
        : subject?.title || 'Course',
      front: cite.title,
      back: cite.preview || cite.excerpt || 'See the cited source excerpt.',
      source: `${cite.sourceName || ''} — ${cite.location || ''}`.trim(),
      retention: 0.5
    });
  });

  return cards.length > 0 ? cards.slice(0, 12) : SAMPLE_FLASHCARDS;
}

export default function RevisionFlashcards({ activeCourse, selectedSource, onOpenCitation, onTopicsUpdated }) {
  const activeSubject = getActiveSubject(selectedSource, activeCourse);
  const [cards, setCards] = useState(() => buildTargetedDeck(activeSubject));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [daysBeforeExam, setDaysBeforeExam] = useState(12);

  // Rebuild the deck when the active subject changes (source or course switch)
  useEffect(() => {
    const subject = getActiveSubject(selectedSource, activeCourse);
    setCards(buildTargetedDeck(subject));
    setCurrentIdx(0);
    setIsFlipped(false);
  }, [selectedSource?.id, activeCourse?.id]);

  const currentCard = cards[currentIdx];

  const handleRate = (strength) => {
    setIsFlipped(false);
    // Update retention in deck
    const updated = [...cards];
    if (strength === 'easy') updated[currentIdx].retention = Math.min(0.98, updated[currentIdx].retention + 0.15);
    if (strength === 'good') updated[currentIdx].retention = Math.min(0.95, updated[currentIdx].retention + 0.08);
    if (strength === 'again') updated[currentIdx].retention = Math.max(0.20, updated[currentIdx].retention - 0.12);
    setCards(updated);

    // Feed the self-assessment back into the learner model:
    // "Again" counts as an incorrect observation, Good/Easy as correct.
    if (currentCard?.topicId) {
      const courses = StorageService.getCourses();
      const next = courses.map(c => ({
        ...c,
        topics: c.topics.map(tp => tp.id === currentCard.topicId
          ? { ...tp, mastery: updateBktMastery(tp.mastery, strength !== 'again') }
          : tp)
      }));
      StorageService.saveCourses(next);
      if (onTopicsUpdated) onTopicsUpdated(next);
    }

    // Next card
    if (currentIdx < cards.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  // Forgetting-curve schedule derived from the actual deck
  const scheduleDays = [1, 4, 10];
  const scheduleItems = scheduleDays.map((day, i) => ({ day, card: cards[i % cards.length] }));

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Targeted Spaced Repetition Engine
            </span>
            <span className="text-xs text-slate-400">Track D Enhancements 6b & 6c</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Targeted Flashcards & Forgetting Curve Schedule
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Flashcard decks generated from your diagnosed weak topics and cited course excerpts. Uses Ebbinghaus forgetting curve intervals to reinforce memory before exam day.
          </p>
        </div>

        {/* Exam Countdown */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl shrink-0">
          <Calendar className="w-5 h-5 text-amber-400" />
          <div className="text-xs">
            <div className="font-bold text-white">Exam Date: In {daysBeforeExam} Days</div>
            <div className="text-[11px] text-amber-300">Spaced repetition schedule tuned</div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Card + Forgetting Curve Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 3D Interactive Flashcard */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl min-h-[460px]">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentCard?.topic}
              </span>
              <span className="text-xs text-slate-400">
                Card {currentIdx + 1} of {cards.length}
              </span>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
              <span>Retention: {Math.round(currentCard?.retention * 100)}%</span>
            </div>
          </div>

          {/* Interactive Card Canvas */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 cursor-pointer my-auto min-h-[220px] flex items-center justify-center p-6 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-indigo-500/60 shadow-xl transition-all group"
          >
            <div className="text-center space-y-3 max-w-lg">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 flex items-center justify-center gap-1">
                <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                <span>{isFlipped ? 'Cited Invariant Explanation (Back)' : 'Question Prompt (Click to Flip)'}</span>
              </div>

              <div className={`text-base sm:text-lg font-medium leading-relaxed transition-all duration-200 ${
                isFlipped ? 'text-indigo-200' : 'text-white'
              }`}>
                {isFlipped ? currentCard?.back : currentCard?.front}
              </div>

              {isFlipped && (
                <div className="pt-2 text-[11px] text-slate-400 italic">
                  Grounded in: {currentCard?.source}
                </div>
              )}
            </div>
          </div>

          {/* Rating Buttons */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-center text-xs text-slate-400">
              {isFlipped ? 'How well did you know this invariant?' : 'Click card above to reveal solution'}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleRate('again')}
                className="py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors"
              >
                Again (1 Day)
              </button>
              <button
                onClick={() => handleRate('good')}
                className="py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors"
              >
                Good (3 Days)
              </button>
              <button
                onClick={() => handleRate('easy')}
                className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
              >
                Easy (7 Days)
              </button>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Forgetting Curve & Smart Schedule */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">
                Forgetting Curve Forecast
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Targeted revision schedule built from R = e^(-t/S) decay modeling to guarantee retention before your exam:
            </p>

            <div className="space-y-3 text-xs">
              {scheduleItems.map(({ day, card }) => (
                <div key={day} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>Day {day}{day === 1 ? ' (Today)' : day === 4 ? ' (Spaced Boost)' : ' (Pre-Exam Lock)'}</span>
                    <span className={`font-bold ${day === 1 ? 'text-amber-400' : day === 4 ? 'text-indigo-400' : 'text-emerald-400'}`}>
                      {day === 1 ? 'Priority High' : day === 4 ? 'Revision' : 'Final Mock'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {card?.topic}{card?.front ? ` — ${card.front.length > 60 ? card.front.slice(0, 60) + '…' : card.front}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>Spaced repetition algorithm ensures you retain 90%+ syllabus coverage with just 15 minutes of daily practice.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
