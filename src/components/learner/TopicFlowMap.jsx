import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { getActiveSubject, getActiveSubjectTopics } from '../../services/subjectService';

export default function TopicFlowMap({ 
  activeCourse, 
  selectedSource,
  onGoToTutor, 
  onStartQuizWithTopic 
}) {
  const activeSubject = getActiveSubject(selectedSource, activeCourse);
  const topics = getActiveSubjectTopics(selectedSource, activeCourse);
  const [selectedTopic, setSelectedTopic] = useState(topics[0] || null);

  // Keep selection in sync when the active subject changes
  useEffect(() => {
    const subject = getActiveSubject(selectedSource, activeCourse);
    const subjectTopics = getActiveSubjectTopics(selectedSource, activeCourse);
    setSelectedTopic(subjectTopics.find(t => t.id === selectedTopic?.id) || subjectTopics[0] || null);
  }, [selectedSource?.id, activeCourse?.id]);

  const getNodeStatus = (topic) => {
    const masteryPct = Math.round(topic.mastery * 100);
    if (masteryPct >= 75) return 'mastered';
    
    // Check prerequisites
    const prereqs = topic.prerequisites || [];
    const allPrereqsMet = prereqs.every(pid => {
      const p = topics.find(t => t.id === pid);
      return p && (p.mastery >= 0.6);
    });

    if (allPrereqsMet || prereqs.length === 0) return 'in-progress';
    return 'locked';
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5" />
              Visual Knowledge Graph & Flow Map
            </span>
            <span className="text-xs text-slate-400">Track D Enhancement 6a</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Curriculum Prerequisite & Dependency Flow
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Interactive structural DAG of course concepts and prerequisite chains. Master foundational primitives (like RPC At-Most-Once semantics) to unlock complex consensus protocols.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-slate-300">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="text-slate-400">Locked</span>
          </div>
        </div>
      </div>

      {/* Main Flow Map Area + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Graph Canvas */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative min-h-[460px] flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Interactive Prerequisite Graph
          </div>

          {/* Node Flow Representation */}
          <div className="space-y-8 my-auto relative">
            
            {topics.map((topic, idx) => {
              const status = getNodeStatus(topic);
              const isSelected = selectedTopic?.id === topic.id;
              const masteryPct = Math.round(topic.mastery * 100);

              return (
                <div key={topic.id} className="relative">
                  
                  {/* Prerequisite Arrow Down */}
                  {idx < topics.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-indigo-500/60 to-slate-700 z-0">
                      <div className="w-2 h-2 border-r-2 border-b-2 border-indigo-400 transform rotate-45 translate-x-[-3px] translate-y-6" />
                    </div>
                  )}

                  {/* Node Card */}
                  <div
                    onClick={() => setSelectedTopic(topic)}
                    className={`relative z-10 p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-xl shadow-indigo-600/10 scale-[1.02]'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Status Icon Indicator */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                        status === 'mastered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        status === 'in-progress' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                        'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {status === 'mastered' && <CheckCircle2 className="w-6 h-6" />}
                        {status === 'in-progress' && <Clock className="w-6 h-6" />}
                        {status === 'locked' && <Lock className="w-6 h-6" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Node {idx + 1} • {topic.difficulty}
                          </span>
                          {topic.prerequisites?.length > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              Requires Prereqs
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-100 mt-0.5">
                          {topic.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {topic.description}
                        </p>
                      </div>
                    </div>

                    {/* Mastery Level Badge */}
                    <div className="text-right shrink-0">
                      <div className="text-base font-extrabold font-mono text-indigo-300">
                        {masteryPct}%
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                        Mastery
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800/80">
            Click any node in the flow to inspect prerequisites, extracted concepts, or jump to practice.
          </div>
        </div>

        {/* Right 1 Col: Selected Node Inspector Drawer */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-2xl">
          {selectedTopic ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Topic Inspector
                  </span>
                  <span className="text-xs text-slate-400 uppercase font-mono">
                    {selectedTopic.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {selectedTopic.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedTopic.description}
                </p>
              </div>

              {/* Key Invariant Concepts */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Key Invariant Concepts:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTopic.keyConcepts?.map((kc, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                    >
                      {kc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prerequisite status */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                <div className="font-semibold text-slate-200">Prerequisite Dependencies:</div>
                <div className="text-[11px] text-slate-400">
                  {selectedTopic.prerequisites?.length > 0 
                    ? selectedTopic.prerequisites.map(pid => topics.find(t => t.id === pid)?.title || pid).join(', ')
                    : 'None (Foundational root node)'}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center p-6 text-slate-400 text-xs">
              Select a node to inspect its details
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <button
              onClick={() => onGoToTutor(`Explain the core invariants of ${selectedTopic?.title}`)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Ask Tutor About This Topic</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onStartQuizWithTopic(selectedTopic?.id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>Test This Topic in Quiz</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
