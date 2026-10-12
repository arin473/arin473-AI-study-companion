import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  Layers, 
  Gauge, 
  HelpCircle, 
  Play, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SAMPLE_QUESTIONS } from '../../data/sampleAssessments';
import { useLanguage } from '../../context/LanguageContext';
import { getActiveSubject, getActiveSubjectTopics, getSubjectSources, isSourceInSubject } from '../../services/subjectService';
import { generateQuestionsFromSubject, filterQuestions } from '../../services/questionGenerator';

export default function AssessmentBuilder({ activeCourse, selectedSource, onStartQuiz, preselectedTopicId }) {
  const { t, translateTopic, translateQuestion } = useLanguage();
  const activeSubject = getActiveSubject(selectedSource, activeCourse);
  const [selectedTopicId, setSelectedTopicId] = useState(preselectedTopicId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedQuestionType, setSelectedQuestionType] = useState('all');
  const [questionCount, setQuestionCount] = useState(4);

  // Reset topic selection when the active subject changes
  useEffect(() => {
    setSelectedTopicId(preselectedTopicId || 'all');
  }, [selectedSource?.id, activeCourse?.id, preselectedTopicId]);

  const subjectTopics = getActiveSubjectTopics(selectedSource, activeCourse);
  
  // Generate questions dynamically from the active subject's source content
  const generatedQuestions = useMemo(() => {
    return generateQuestionsFromSubject(activeSubject);
  }, [activeSubject?.id, activeSubject?.title, activeSubject?.topics?.length, activeSubject?.citations?.length]);
  
  // Source isolation: when a source is selected, only include questions from
  // sources belonging to the same subject. This prevents cross-subject retrieval.
  const subjectSources = activeSubject.isSource 
    ? getSubjectSources(activeSubject.subjectId, [activeCourse])
    : [];
  const subjectSourceIds = new Set(subjectSources.map(s => s.id));
  
  // Filter static questions by subject isolation
  const staticQuestions = SAMPLE_QUESTIONS.filter(q => {
    if (activeSubject.isSource) {
      // For source-selected state, only include questions whose source belongs to the same subject
      const qSource = activeCourse?.sources?.find(s => s.id === q.sourceId);
      if (qSource && !isSourceInSubject(qSource, activeSubject.subjectId)) return false;
      // Also match by topic title since source topics don't have the same IDs as course topics
      const qTopic = activeCourse?.topics?.find(ct => ct.id === q.topicId);
      const subjectTopicTitles = new Set(subjectTopics.map(t => t.title.toLowerCase()));
      return qTopic && subjectTopicTitles.has(qTopic.title.toLowerCase());
    }
    return q.courseId === activeCourse?.id;
  }).map(translateQuestion);
  
  // Combine generated + static, with generated taking priority for source-selected state
  const allQuestions = activeSubject.isSource 
    ? [...generatedQuestions, ...staticQuestions]
    : [...staticQuestions, ...generatedQuestions];
  
  const filteredPool = filterQuestions(allQuestions, selectedTopicId, selectedQuestionType)
    .filter(q => selectedDifficulty === 'all' || q.difficulty === selectedDifficulty);

  const availableCount = filteredPool.length;

  const handleLaunch = () => {
    const questionsToRun = filteredPool.slice(0, questionCount);
    onStartQuiz(questionsToRun);
  };

  const topics = subjectTopics.map(translateTopic);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" />
              {t('assessmentBadge')}
            </span>
            <span className="text-xs text-slate-400">{t('trackDReq3')}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t('assessmentTitle')}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {t('assessmentDesc')}
          </p>
        </div>

        <button
          onClick={handleLaunch}
          disabled={availableCount === 0}
          title={availableCount === 0 ? 'No questions match the current topic + format combination' : ''}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 shrink-0"
        >
          <Play className="w-4 h-4 ml-0.5 fill-white" />
          <span>{t('launchQuizBtn')}</span>
        </button>
      </div>

      {/* Scope Configuration Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form Controls */}
        <div className="md:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            {t('configScope')}
          </h3>

          {/* Topic Scope */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{t('targetTopic')}</span>
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">{t('fullSyllabus')}</option>
              {topics.map((tItem) => (
                <option key={tItem.id} value={tItem.id}>
                  {tItem.title} ({Math.round(tItem.mastery * 100)}% {t('bktMastery')})
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty & Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-400" />
                <span>{t('difficultyLevel')}</span>
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">{t('diffAdaptive')}</option>
                <option value="beginner">{t('diffBeginner')}</option>
                <option value="intermediate">{t('diffIntermediate')}</option>
                <option value="advanced">{t('diffAdvanced')}</option>
              </select>
            </div>

            {/* Question Format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>{t('questionFormat')}</span>
              </label>
              <select
                value={selectedQuestionType}
                onChange={(e) => setSelectedQuestionType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">{t('formatAll')}</option>
                <option value="MCQ">{t('formatMCQ')}</option>
                <option value="SHORT_ANSWER">{t('formatShort')}</option>
                <option value="NUMERICAL">{t('formatNumerical')}</option>
              </select>
            </div>

          </div>

          {/* Question Count Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">{t('totalQuestionsLabel')}</span>
              <span className="font-mono text-indigo-400 font-bold">{questionCount}</span>
            </div>
            <input 
              type="range"
              min="2"
              max="10"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

        </div>

        {/* Right 1 Col: Quality & Verification Assurance */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {t('qualityTitle')}
              </h4>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>{t('crossModelVal')}</div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>{t('noveltyGuarantee')}</div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>{t('citedFeedbackGuarantee')}</div>
              </div>
            </div>
          </div>

          {availableCount === 0 ? (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-[11px] text-red-400 flex items-center gap-1.5">
              <span>⚠</span>
              <span>No questions match the current topic + format combination. Adjust the filters above.</span>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              {availableCount} {t('questionsReadyInPool')}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
