import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  FileCheck2, 
  BookOpen, 
  ExternalLink,
  HelpCircle,
  Award,
  ChevronLeft
} from 'lucide-react';

export default function QuizRunner({ 
  questions, 
  onFinishQuiz, 
  onCancel, 
  onOpenCitation 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [textAnswers, setTextAnswers] = useState({});
  const [numericalAnswers, setNumericalAnswers] = useState({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userResults, setUserResults] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isCurrentAnswered = () => {
    if (currentQ.type === 'MCQ') return selectedAnswers[currentIndex] !== undefined;
    if (currentQ.type === 'NUMERICAL') return Boolean(numericalAnswers[currentIndex]?.trim());
    if (currentQ.type === 'SHORT_ANSWER') return Boolean(textAnswers[currentIndex]?.trim());
    return false;
  };

  const checkIsCorrect = () => {
    if (currentQ.type === 'MCQ') {
      return selectedAnswers[currentIndex] === currentQ.correctAnswerIndex;
    }
    if (currentQ.type === 'NUMERICAL') {
      const val = parseFloat(numericalAnswers[currentIndex]);
      if (Number.isNaN(val)) return false;
      return Math.abs(val - currentQ.correctValue) <= (currentQ.tolerance || 0);
    }
    if (currentQ.type === 'SHORT_ANSWER') {
      const ans = (textAnswers[currentIndex] || '').toLowerCase().trim();

      // Path 1: rubric array exists — require the answer to match at least
      // half of the rubric criteria (each criterion is matched by checking
      // whether key terms from that criterion appear in the answer).
      if (Array.isArray(currentQ.rubric) && currentQ.rubric.length > 0) {
        const matchedCriteria = currentQ.rubric.filter((criterion) => {
          // Extract meaningful words (≥4 chars) from each criterion as keywords.
          const keywords = criterion
            .toLowerCase()
            .match(/\b[a-z]{4,}\b/g) || [];
          // A criterion is matched if at least half its keywords are present.
          if (keywords.length === 0) return false;
          const hits = keywords.filter((kw) => ans.includes(kw)).length;
          return hits >= Math.ceil(keywords.length / 2);
        });
        return matchedCriteria.length >= Math.ceil(currentQ.rubric.length / 2);
      }

      // Path 2: no rubric but a sample model answer exists — extract keywords
      // from the model answer and require the learner to hit at least half.
      if (currentQ.sampleModelAnswer) {
        const modelKeywords = (currentQ.sampleModelAnswer.toLowerCase().match(/\b[a-z]{5,}\b/g) || []);
        const uniqueKeywords = [...new Set(modelKeywords)];
        if (uniqueKeywords.length === 0) return false;
        const hits = uniqueKeywords.filter((kw) => ans.includes(kw)).length;
        return hits >= Math.ceil(uniqueKeywords.length / 2);
      }

      // Path 3: no rubric and no model answer — cannot grade automatically.
      // Mark as "pending review" (returns false so it does not award credit
      // for arbitrary text of any length).
      return false;
    }
    return false;
  };

  const handleSubmitAnswer = () => {
    const correct = checkIsCorrect();
    setIsAnswerSubmitted(true);

    const resultRecord = {
      questionId: currentQ.id,
      topicId: currentQ.topicId,
      type: currentQ.type,
      question: currentQ.question,
      isCorrect: correct,
      userAnswer: currentQ.type === 'MCQ' ? selectedAnswers[currentIndex] :
                  currentQ.type === 'NUMERICAL' ? numericalAnswers[currentIndex] :
                  textAnswers[currentIndex],
      citation: currentQ.citation,
      explanation: currentQ.explanation
    };

    setUserResults(prev => [...prev.filter(r => r.questionId !== currentQ.id), resultRecord]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswerSubmitted(false);
    } else {
      // Finished all questions
      onFinishQuiz({
        results: userResults,
        timeTakenSeconds: timerSeconds,
        totalQuestions: questions.length,
        correctCount: userResults.filter(r => r.isCorrect).length
      });
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Runner Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-slate-800 shadow-xl">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Assessment</span>
        </button>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-indigo-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
          <span className="font-semibold text-slate-300">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Topic & Difficulty Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentQ.type}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              {currentQ.difficulty}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>BKT Calibrated Item</span>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-medium text-slate-100 leading-snug">
          {currentQ.question}
        </h3>

        {/* Multiple Choice Options */}
        {currentQ.type === 'MCQ' && (
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              const isCorrectAnswer = idx === currentQ.correctAnswerIndex;
              
              let cardStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';
              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  cardStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-medium';
                } else if (isSelected && !isCorrectAnswer) {
                  cardStyle = 'bg-red-500/20 border-red-500 text-red-200';
                }
              } else if (isSelected) {
                cardStyle = 'bg-indigo-600/20 border-indigo-500 text-white font-medium shadow-md';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentIndex]: idx })}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all flex items-start gap-3.5 ${cardStyle}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5 ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Numerical Input */}
        {currentQ.type === 'NUMERICAL' && (
          <div className="space-y-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            {currentQ.hint && (
              <div className="text-xs text-amber-300/90 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Formula Hint: {currentQ.hint}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <input 
                type="number"
                placeholder="Enter numerical answer"
                disabled={isAnswerSubmitted}
                value={numericalAnswers[currentIndex] || ''}
                onChange={(e) => setNumericalAnswers({ ...numericalAnswers, [currentIndex]: e.target.value })}
                className="w-48 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs text-slate-400 font-semibold">{currentQ.unit}</span>
            </div>
          </div>
        )}

        {/* Short Answer Input */}
        {currentQ.type === 'SHORT_ANSWER' && (
          <div className="space-y-3">
            <textarea
              rows={4}
              placeholder="Provide your conceptual proof or explanation here..."
              disabled={isAnswerSubmitted}
              value={textAnswers[currentIndex] || ''}
              onChange={(e) => setTextAnswers({ ...textAnswers, [currentIndex]: e.target.value })}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
            />
          </div>
        )}

        {/* Feedback Reveal Card (Post Submission) */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-xl border space-y-3 animate-in fade-in duration-200 ${
            checkIsCorrect()
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/30 border-red-500/40 text-red-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {checkIsCorrect() ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>
                    {currentQ.type === 'SHORT_ANSWER'
                      ? 'Rubric Criteria Met! Mastery recalculated at assessment completion.'
                      : 'Correct Answer! Mastery recalculated at assessment completion.'}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>
                    {currentQ.type === 'SHORT_ANSWER' && !currentQ.rubric && !currentQ.sampleModelAnswer
                      ? 'Auto-grading unavailable — no rubric defined. Review the model answer below.'
                      : currentQ.type === 'SHORT_ANSWER'
                      ? 'Rubric Criteria Not Met. Compare with the model answer below.'
                      : 'Incorrect. Review the cited source invariant below.'}
                  </span>
                </>
              )}
            </div>

            {/* Rubric checklist shown for SHORT_ANSWER */}
            {currentQ.type === 'SHORT_ANSWER' && Array.isArray(currentQ.rubric) && currentQ.rubric.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Rubric Criteria:</p>
                <ul className="space-y-1">
                  {currentQ.rubric.map((criterion, i) => {
                    const keywords = criterion.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
                    const ans = (textAnswers[currentIndex] || '').toLowerCase().trim();
                    const hits = keywords.filter((kw) => ans.includes(kw)).length;
                    const met = keywords.length > 0 && hits >= Math.ceil(keywords.length / 2);
                    return (
                      <li key={i} className={`flex items-start gap-1.5 text-[11px] ${met ? 'text-emerald-300' : 'text-red-300'}`}>
                        {met
                          ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          : <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                        <span>{criterion}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Model answer shown for SHORT_ANSWER */}
            {currentQ.type === 'SHORT_ANSWER' && currentQ.sampleModelAnswer && (
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Model Answer:</p>
                <p className="text-xs text-slate-300 leading-relaxed italic">{currentQ.sampleModelAnswer}</p>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentQ.explanation}
            </p>

            {/* Source Citation Excerpt Pill */}
            {currentQ.citation && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onOpenCitation({
                    ...currentQ.citation,
                    title: currentQ.question,
                    preview: currentQ.citation.excerpt
                  })}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 hover:bg-indigo-600/30 border border-slate-800 text-xs text-indigo-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Verify in {currentQ.citation.sourceName} ({currentQ.citation.location})</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 ml-1" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit & Next Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {isAnswerSubmitted ? 'Answer verified against syllabus knowledge base' : 'Select an answer to proceed'}
          </div>

          {!isAnswerSubmitted ? (
            <button
              disabled={!isCurrentAnswered()}
              onClick={handleSubmitAnswer}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Verify Answer</span>
              <FileCheck2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all"
            >
              <span>{isLastQuestion ? 'View Assessment Report' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
