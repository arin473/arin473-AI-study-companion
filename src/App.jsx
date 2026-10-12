import React, { useState, useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import Header from './components/common/Header';
import Sidebar, { NAV_ITEMS } from './components/common/Sidebar';
import CitationModal from './components/common/CitationModal';
import DiagnosticModal from './components/common/DiagnosticModal';
import SetupWizardModal from './components/common/SetupWizardModal';

// Tabs
import MasteryDashboard from './components/learner/MasteryDashboard';
import MultimodalUpload from './components/ingestion/MultimodalUpload';
import TutorChat from './components/tutor/TutorChat';
import AudioTutorPanel from './components/tutor/AudioTutorPanel';
import AssessmentBuilder from './components/assessment/AssessmentBuilder';
import QuizRunner from './components/assessment/QuizRunner';
import AssessmentReport from './components/assessment/AssessmentReport';
import TopicFlowMap from './components/learner/TopicFlowMap';
import RevisionFlashcards from './components/learner/RevisionFlashcards';
import SystemEvaluation from './components/settings/SystemEvaluation';
import SystemSettings from './components/settings/SystemSettings';

// Services
import { StorageService } from './services/storageService';
import { updateBktMastery } from './services/bktLearnerModel';

export default function App() {
  // Language from global context
  const { t } = useLanguage();

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState(() => StorageService.getCourses());
  const [activeCourseId, setActiveCourseId] = useState(() => StorageService.getActiveCourseId());
  const [settings, setSettings] = useState(() => StorageService.getSettings());
  const [isDiagnosticDone, setIsDiagnosticDone] = useState(() => StorageService.isDiagnosticCompleted());
  
  // Modals
  const [activeCitation, setActiveCitation] = useState(null);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Active Quiz State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState(null);
  const [assessmentSummary, setAssessmentSummary] = useState(null);
  // Topic pre-filter — set when user clicks "Test This Topic" in TopicFlowMap
  const [preselectedTopicId, setPreselectedTopicId] = useState(null);

  // Active Course Object
  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  // Selected Source State
  const [selectedSourceId, setSelectedSourceId] = useState(() => {
    const saved = StorageService.getSelectedSourceId();
    if (saved) return saved;
    const initialCourse = courses.find(c => c.id === StorageService.getActiveCourseId()) || courses[0];
    const uploadedInCourse = initialCourse?.sources?.find(s => s.id?.startsWith('src-upload-') || s.geminiFileUri);
    if (uploadedInCourse) return uploadedInCourse.id;
    const anyUploaded = courses.flatMap(c => c.sources || []).find(s => s.id?.startsWith('src-upload-') || s.geminiFileUri);
    return anyUploaded?.id || null;
  });

  // Resolve active source
  const selectedSource = activeCourse?.sources?.find(s => s.id === selectedSourceId)
    || courses.flatMap(c => c.sources || []).find(s => s.id === selectedSourceId)
    || null;

  const activeChatKey = selectedSource?.id || activeCourse?.id;

  // Chat Messages for current course/source
  const [chatMessages, setChatMessages] = useState(() => StorageService.getChatMessages(activeChatKey));

  // Sync chat when active course or active source changes
  useEffect(() => {
    if (activeChatKey) {
      setChatMessages(StorageService.getChatMessages(activeChatKey));
    }
  }, [activeChatKey]);

  // Calculate overall BKT mastery
  const topics = activeCourse?.topics || [];
  const overallMastery = topics.length > 0 
    ? Math.round((topics.reduce((acc, t) => acc + (t.mastery || 0), 0) / topics.length) * 100)
    : 65;

  // Handlers
  const handleSelectCourse = (courseId) => {
    setActiveCourseId(courseId);
    StorageService.setActiveCourseId(courseId);
    const targetCourse = courses.find(c => c.id === courseId);
    const sourceInCourse = targetCourse?.sources?.find(s => s.id === selectedSourceId);
    if (!sourceInCourse) {
      const nextSourceId = targetCourse?.sources?.[0]?.id || null;
      setSelectedSourceId(nextSourceId);
      StorageService.setSelectedSourceId(nextSourceId);
    }
  };

  const handleSelectSource = (sourceOrId) => {
    const id = typeof sourceOrId === 'string' ? sourceOrId : sourceOrId?.id;
    setSelectedSourceId(id);
    StorageService.setSelectedSourceId(id);

    if (id) {
      const ownerCourse = courses.find(c => c.sources?.some(s => s.id === id));
      if (ownerCourse && ownerCourse.id !== activeCourse?.id) {
        setActiveCourseId(ownerCourse.id);
        StorageService.setActiveCourseId(ownerCourse.id);
      }
    }
  };

  const handleSaveMessages = (msgs) => {
    setChatMessages(msgs);
    if (activeChatKey) {
      StorageService.saveChatMessages(activeChatKey, msgs);
    }
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleCompleteDiagnostic = ({ score, baselineMastery }) => {
    setIsDiagnosticDone(true);
    StorageService.setDiagnosticCompleted(true);

    // Update topic masteries with baseline
    const updatedCourses = courses.map(c => {
      if (c.id === activeCourse.id) {
        return {
          ...c,
          topics: c.topics.map(t => ({
            ...t,
            mastery: baselineMastery
          }))
        };
      }
      return c;
    });

    setCourses(updatedCourses);
    StorageService.saveCourses(updatedCourses);
  };

  const handleAddSource = (newSource) => {
    const updatedCourses = courses.map(c => {
      if (c.id === activeCourse.id) {
        return {
          ...c,
          sources: [newSource, ...c.sources]
        };
      }
      return c;
    });
    setCourses(updatedCourses);
    StorageService.saveCourses(updatedCourses);
    if (newSource?.id) {
      handleSelectSource(newSource.id);
    }
  };

  // Assessment flow
  const handleStartQuiz = (questions) => {
    setActiveQuizQuestions(questions);
    setAssessmentSummary(null);
    setActiveTab('assessments');
  };

  const handleFinishQuiz = (summary) => {
    // Apply Bayesian Knowledge Tracing updates to topics, capturing the
    // real per-topic mastery deltas so the report can display honest values
    const masteryDeltas = {};
    const updatedCourses = courses.map(c => {
      if (c.id === activeCourse.id) {
        const newTopics = c.topics.map(topic => {
          // Check results for this topic
          const matchingResults = summary.results.filter(r => r.topicId === topic.id);
          if (matchingResults.length === 0) return topic;

          let currentP = topic.mastery;
          matchingResults.forEach(r => {
            currentP = updateBktMastery(currentP, r.isCorrect);
          });

          masteryDeltas[topic.id] = Number((currentP - topic.mastery).toFixed(3));
          return { ...topic, mastery: currentP };
        });
        return { ...c, topics: newTopics };
      }
      return c;
    });

    setAssessmentSummary({ ...summary, masteryDeltas });
    setActiveQuizQuestions(null);
    StorageService.saveQuizAttempt({ ...summary, masteryDeltas });
    setCourses(updatedCourses);
    StorageService.saveCourses(updatedCourses);
  };

  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset all courses, diagnostic scores, and chat logs?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header */}
      <Header
        courses={courses}
        activeCourse={activeCourse}
        selectedSource={selectedSource}
        onSelectCourse={handleSelectCourse}
        onSelectSource={handleSelectSource}
        masteryPercentage={overallMastery}
        isDiagnosticDone={isDiagnosticDone}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenSetup={() => setIsSetupOpen(true)}
        settings={settings}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Desktop Sidebar Navigation */}
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setActiveQuizQuestions(null);
          }}
          activeCourse={activeCourse}
          overallMastery={overallMastery}
          isDiagnosticDone={isDiagnosticDone}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <MasteryDashboard 
              activeCourse={activeCourse}
              selectedSource={selectedSource}
              overallMastery={overallMastery}
              isDiagnosticDone={isDiagnosticDone}
              onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
              onStartQuiz={() => {
                setActiveTab('assessments');
                setAssessmentSummary(null);
              }}
              onGoToTutor={() => setActiveTab('tutor')}
              onGoToRevision={() => setActiveTab('revision')}
            />
          )}

          {/* Multimodal Knowledge Ingestion Tab */}
          {activeTab === 'ingestion' && (
            <MultimodalUpload 
              activeCourse={activeCourse}
              selectedSource={selectedSource}
              onSelectSource={handleSelectSource}
              onOpenCitation={(cite) => setActiveCitation(cite)}
              onAddSource={handleAddSource}
            />
          )}

          {/* Grounded AI Tutor Tab */}
          {activeTab === 'tutor' && (
            <TutorChat 
              activeCourse={activeCourse}
              selectedSource={selectedSource}
              chatMessages={chatMessages}
              onSaveMessages={handleSaveMessages}
              onOpenCitation={(cite) => setActiveCitation(cite)}
              settings={settings}
            />
          )}

          {/* Audio Tutor Room Tab */}
          {activeTab === 'audio-session' && (
            <AudioTutorPanel 
              activeCourse={activeCourse}
              selectedSource={selectedSource}
              settings={settings}
            />
          )}

          {/* Adaptive Assessments Tab */}
          {activeTab === 'assessments' && (
            <>
              {activeQuizQuestions ? (
                <QuizRunner 
                  questions={activeQuizQuestions}
                  onFinishQuiz={handleFinishQuiz}
                  onCancel={() => {
                    setActiveQuizQuestions(null);
                    setPreselectedTopicId(null);
                  }}
                  onOpenCitation={(cite) => setActiveCitation(cite)}
                />
              ) : assessmentSummary ? (
                <AssessmentReport 
                  assessmentSummary={assessmentSummary}
                  activeCourse={activeCourse}
                  onRetake={() => {
                    setAssessmentSummary(null);
                    setActiveQuizQuestions(null);
                    setPreselectedTopicId(null);
                  }}
                  onGoToRevision={() => setActiveTab('revision')}
                  onGoToAudio={() => setActiveTab('audio-session')}
                />
              ) : (
                <AssessmentBuilder 
                  activeCourse={activeCourse}
                  selectedSource={selectedSource}
                  onStartQuiz={handleStartQuiz}
                  preselectedTopicId={preselectedTopicId}
                />
              )}
            </>
          )}

          {/* Visual Course Flow Map Tab */}
          {activeTab === 'flowmap' && (
            <TopicFlowMap 
              activeCourse={activeCourse}
              selectedSource={selectedSource}
              onGoToTutor={(prompt) => {
                setActiveTab('tutor');
                handleSaveMessages([
                  ...chatMessages,
                  {
                    id: 'msg-' + Date.now(),
                    sender: 'user',
                    text: prompt,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              onStartQuizWithTopic={(topicId) => {
                // Always land on AssessmentBuilder with the topic pre-selected.
                // The user can then also choose a question format (MCQ / SHORT_ANSWER /
                // NUMERICAL) before clicking Launch — ensuring both the topic AND the
                // format filter are respected by AssessmentBuilder.handleLaunch.
                setAssessmentSummary(null);
                setActiveQuizQuestions(null);
                setPreselectedTopicId(topicId);
                setActiveTab('assessments');
              }}
            />
          )}

          {/* Targeted Revision Flashcards Tab */}
          {activeTab === 'revision' && (
            <RevisionFlashcards 
              activeCourse={activeCourse}
              selectedSource={selectedSource}
              onOpenCitation={(cite) => setActiveCitation(cite)}
            />
          )}

          {/* System Benchmarks Tab */}
          {activeTab === 'evaluation' && (
            <SystemEvaluation 
              activeCourse={activeCourse}
              selectedSource={selectedSource}
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <SystemSettings 
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onResetAll={handleResetAll}
            />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (all modules reachable, horizontally scrollable) */}
      <nav className="md:hidden glass-panel border-t border-slate-800 p-2 flex items-center gap-1 overflow-x-auto sticky bottom-0 z-40">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setActiveQuizQuestions(null);
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] transition-all ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{t(item.labelKey).split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Citation Modal */}
      <CitationModal
        citation={activeCitation}
        isOpen={Boolean(activeCitation)}
        onClose={() => setActiveCitation(null)}
      />

      {/* Diagnostic Intake Modal */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onCompleteDiagnostic={handleCompleteDiagnostic}
      />

      {/* Setup Wizard Modal */}
      <SetupWizardModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        courses={courses}
        activeCourseId={activeCourse?.id}
        onSelectCourse={handleSelectCourse}
      />

    </div>
  );
}
