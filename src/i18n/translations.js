/**
 * Complete Internationalization (i18n) Dictionary
 * Supports English ('en') and Hindi ('hi')
 */

export const TRANSLATIONS = {
  en: {
    // Brand & Header
    appTitle: 'AI Study Companion',
    appSubtitle: 'Multimodal Source-Grounded Tutoring & Adaptive BKT Engine',
    trackDBadge: 'Track D',
    activeSubject: 'Active Subject',
    switchKnowledgeBase: 'Switch Knowledge Base',
    intakeDiagnostic: 'Intake Diagnostic',
    diagnosticCalibrated: 'Diagnostic Calibrated',
    bktMastery: 'BKT Mastery',
    geminiLive: 'Gemini 1.5 Live',
    groundedCore: 'Grounded Core',
    languageEnglish: 'English',
    languageHindi: 'हिन्दी (Hindi)',
    languageHinglish: 'Hinglish',
    
    // Sidebar Navigation
    navDashboard: 'Learner Dashboard',
    navIngestion: 'Multimodal Ingestion',
    navTutor: 'Grounded AI Tutor',
    navAudio: 'Audio Tutor Room',
    navAssessments: 'Adaptive Assessments',
    navFlowMap: 'Visual Course Flow',
    navRevision: 'Targeted Revision',
    navEvaluation: 'System Benchmarks',
    navSettings: 'Setup & Model Config',
    navigationModules: 'Navigation Modules',
    activeStreak: 'Active Streak',
    days: 'Days',
    modelTuned: 'Model Tuned',
    diagnosticPending: 'Diagnostic Pending',

    // Dashboard
    bktActiveBadge: 'Bayesian Knowledge Tracing (BKT) Active',
    trackDReq4: 'Track D Requirement 4',
    dashboardTitle: 'Learner Model & Adaptive Mastery',
    dashboardDesc: 'Your personalized learning curve updates continuously after every quiz, chat interaction, and flashcard review. Mastery estimates adapt using probabilistic cognitive modeling.',
    initCalibNeeded: 'Initial Calibration Needed',
    initCalibDesc: 'Take the 3-minute intake test to calibrate your baseline topic knowledge.',
    startDiagnosticBtn: 'Start Diagnostic Test',
    priorProbInit: 'Prior probabilities initialized',
    overallBktMastery: 'Overall BKT Mastery',
    thisWeekGain: '+8.4% this week',
    strongestConcept: 'Strongest Concept',
    safeFromForgetting: 'Safe from forgetting',
    retention: 'Retention',
    targetedWeakTopic: 'Targeted Weak Topic',
    needsReview: 'Needs Review',
    activeFocusStreak: 'Active Focus Streak',
    totalStudyHours: '3.4 hrs total',
    nextExamTarget: 'Next exam target: 12 days',
    perTopicMastery: 'Per-Topic Latent Mastery Estimates (BKT)',
    updatedLive: 'P(L) Updated Live',
    adaptiveNextAction: 'Adaptive Next Action',
    recommendedSteps: 'Recommended Steps:',
    launchPracticeBtn: 'Launch Practice on Weak Topics',
    reviewFlashcardsBtn: 'Review Targeted Flashcards',

    // Ingestion
    ingestionBadge: 'Multimodal Knowledge Ingestion Pipeline',
    trackDReq1: 'Track D Requirement 1',
    ingestionTitle: 'Unified Course Materials & Source Linkage',
    ingestionDesc: 'Ingest lecture videos, textbooks, and slide decks without manual preprocessing. The companion extracts formulas, figures, diagrams, and aligns every concept to its origin (page number, slide, or video timestamp).',
    btnIngestVideo: 'Ingest Video',
    btnIngestPdf: 'Ingest PDF',
    btnIngestSlides: 'Ingest Slides',
    filterAll: 'All Materials',
    filterVideos: 'Videos',
    filterTextbooks: 'Textbooks & Papers',
    filterSlides: 'Slides',
    searchPlaceholder: 'Search ingested sources & concepts...',
    statusIndexed: 'Indexed',
    inspectOriginLink: 'Inspect Origin Link & Excerpt',
    extractedFiguresTitle: 'Extracted Multimodal Figures, Diagrams & Architecture Schemas',
    extractedFiguresSubtitle: 'Preserved for visual question answering',

    // Tutor Chat
    tutorTitle: 'Source-Grounded AI Tutor',
    syllabusGroundedBadge: '100% Syllabus Grounded',
    tutorSubtitle: 'Answers are backed by cited textbook pages, lecture video timestamps, and slides.',
    clearChat: 'Clear',
    askCompanionHeader: 'Ask your AI Study Companion',
    askCompanionSub: 'Tutor answers only from your ingested course: {course}. Unsupported queries will be flagged.',
    suggestedQuestions: 'Suggested Questions:',
    outsideCourseScope: 'Outside Course Scope:',
    outsideCourseDesc: 'This query is not backed by your ingested textbooks, slides, or lecture videos.',
    citedSourcesHeader: 'Cited Sources & Origin Links:',
    synthesizingMsg: 'Synthesizing source-grounded explanation with verbatim citations...',
    inputPlaceholder: 'Ask a question grounded in {course}...',
    btnAskTutor: 'Ask Tutor',
    speechTitle: 'Read out explanation (Web Speech Audio)',
    copyTitle: 'Copy explanation',

    // Audio Room
    audioRoomBadge: 'Interactive Audio Tutoring Room',
    trackDEnhancement6: 'Track D Enhancements 6d & 6e',
    audioTitle: 'Targeted Audio Briefs & Bilingual Voice Tutoring',
    audioDesc: 'Hands-free auditory revision with AI speech synthesis. Toggle between standard English lectures and Hinglish conversational breakdowns for deep conceptual comprehension.',
    hinglishMode: 'Hinglish Mode:',
    enabled: 'Enabled',
    disabled: 'Disabled',
    availableAudioBriefs: 'Available Revision Audio Briefs',
    nowPlaying: 'Now Playing:',
    sourceVerifiedBrief: 'Source-Verified Audio Brief',
    groundedIn: 'Grounded in:',
    liveTranscript: 'Live Audio Transcript',
    spokenPct: 'spoken',
    voiceEngine: 'Voice Engine: Browser Web Speech API',
    playAudioBrief: 'Play Audio Brief',
    pauseAudioBrief: 'Pause Audio Session',

    // Assessments
    assessmentBadge: 'Adaptive Assessment Generator',
    trackDReq3: 'Track D Requirement 3',
    assessmentTitle: 'Curated Scope & Multimodal Exam Engine',
    assessmentDesc: 'Generate custom exams spanning Multiple Choice (MCQ), Conceptual Short Answer, and Numerical calculations. Each question is strictly tagged to an ingested source location and verified against misconceptions.',
    launchQuizBtn: 'Launch Adaptive Quiz',
    configScope: 'Configure Assessment Scope',
    targetTopic: 'Target Topic / Domain:',
    fullSyllabus: 'Full Syllabus (All Topics)',
    difficultyLevel: 'Difficulty Level:',
    diffAdaptive: 'Adaptive (Mixed Difficulties)',
    diffBeginner: 'Beginner (Foundational)',
    diffIntermediate: 'Intermediate (Core Invariants)',
    diffAdvanced: 'Advanced (Proof & Edge Cases)',
    questionFormat: 'Question Format:',
    formatAll: 'All Modalities (MCQ, Short Answer, Numerical)',
    formatMCQ: 'Multiple Choice Questions (MCQ)',
    formatShort: 'Conceptual Short Answer',
    formatNumerical: 'Numerical & Quorum Calculations',
    totalQuestionsLabel: 'Total Questions:',
    qualityTitle: 'Verification & Quality',
    crossModelVal: 'Cross-Model Answer Validation: All answer keys are verified against syllabus formal proofs.',
    noveltyGuarantee: 'Novelty Guarantee: Questions avoid repetition using semantic hashing across sessions.',
    citedFeedbackGuarantee: 'Cited Excerpt Feedback: Every answer provides direct page, slide, or video timestamp feedback.',
    questionsReadyInPool: 'Questions ready in pool',

    // Quiz Runner
    exitAssessment: 'Exit Assessment',
    questionNav: 'Question {current} of {total}',
    bktCalibratedItem: 'BKT Calibrated Item',
    formulaHint: 'Formula Hint:',
    verifyAnswerBtn: 'Verify Answer',
    nextQuestionBtn: 'Next Question',
    viewReportBtn: 'View Assessment Report',
    correctAnswerMsg: 'Correct Answer! BKT Mastery Updated (+12%)',
    incorrectAnswerMsg: 'Incorrect. Review the cited source invariant below.',
    verifyInSource: 'Verify in {source} ({location})',

    // Assessment Report
    postAssessmentBadge: 'Post-Assessment Analysis Report',
    trackDReq3c: 'Track D Requirement 3c',
    masteryAdvanced: 'Mastery Advanced! 🎉',
    gapsIdentified: 'Diagnostics & Gap Identified',
    reportDesc: 'Your responses were processed through Bayesian Knowledge Tracing (BKT) to recalculate latent mastery parameters across all assessed topic nodes.',
    finalScore: 'Final Score',
    correctLabel: 'Correct:',
    timeTaken: 'Time:',
    weakTopicsTitle: 'Diagnosed Weak Topics & Misconceptions',
    weakTopicsDesc: 'The learner model identified conceptual gaps in the following topics:',
    needsTargetedReview: 'Needs Targeted Review',
    likelyMisconception: 'Likely Misconception: Confusing leader commitment invariants across terms or quorum counting during network partitions.',
    noMisconceptionsTitle: 'No Critical Misconceptions Detected!',
    noMisconceptionsDesc: 'You demonstrated strong invariant retention across all evaluated course sections.',
    generateFlashcardsBtn: 'Generate Spaced Repetition Flashcards',
    bktCalibrationShift: 'Bayesian Knowledge Tracing Updates',
    bktRecalculatedDesc: 'Per-topic latent probability estimates P(L) updated in real-time using slip rate (S=0.10) and transition rate (T=0.15):',
    retakeScopeBtn: 'Retake Scope',
    audioBriefBtn: 'Audio Brief',

    // Course Flow Map
    flowMapBadge: 'Visual Knowledge Graph & Flow Map',
    flowMapTitle: 'Curriculum Prerequisite & Dependency Flow',
    flowMapDesc: 'Interactive structural DAG of course concepts and prerequisite chains. Master foundational primitives (like RPC At-Most-Once semantics) to unlock complex consensus protocols.',
    statusMastered: 'Mastered',
    statusInProgress: 'In Progress',
    statusLocked: 'Locked',
    interactivePrereqGraph: 'Interactive Prerequisite Graph',
    nodeRequiresPrereq: 'Requires Prereqs',
    clickNodeHint: 'Click any node in the flow to inspect prerequisites, extracted concepts, or jump to practice.',
    topicInspector: 'Topic Inspector',
    keyInvariants: 'Key Invariant Concepts:',
    prereqDependencies: 'Prerequisite Dependencies:',
    noneFoundational: 'None (Foundational root node)',
    askTutorAboutTopic: 'Ask Tutor About This Topic',
    testTopicInQuiz: 'Test This Topic in Quiz',

    // Revision Flashcards
    srBadge: 'Targeted Spaced Repetition Engine',
    flashcardsTitle: 'Targeted Flashcards & Forgetting Curve Schedule',
    flashcardsDesc: 'Automatic flashcard decks generated directly from your diagnosed weak topics and assessment misconceptions. Uses Ebbinghaus forgetting curve intervals to reinforce memory before exam day.',
    examInDays: 'Exam Date: In {days} Days',
    srScheduleTuned: 'Spaced repetition schedule tuned',
    cardNav: 'Card {current} of {total}',
    questionPromptClick: 'Question Prompt (Click to Flip)',
    citedExplanationBack: 'Cited Invariant Explanation (Back)',
    howWellDidYouKnow: 'How well did you know this invariant?',
    clickCardToReveal: 'Click card above to reveal solution',
    btnAgain: 'Again (1 Day)',
    btnGood: 'Good (3 Days)',
    btnEasy: 'Easy (7 Days)',
    forgettingCurveTitle: 'Forgetting Curve Forecast',
    forgettingCurveDesc: 'Targeted revision schedule built from R = e^(-t/S) decay modeling to guarantee retention before your exam:',
    todayPriority: 'Today (Day 1)',
    priorityHigh: 'Priority High',
    spacedBoost: 'Day 4 (Spaced Boost)',
    preExamLock: 'Day 10 (Pre-Exam Lock)',
    srGuarantee: 'Spaced repetition algorithm ensures you retain 90%+ syllabus coverage with just 15 minutes of daily practice.',

    // System Benchmarks
    benchmarksBadge: 'Automated Pipeline Benchmarking',
    benchmarksTitle: 'System Evaluation & Framework Benchmarks',
    benchmarksDesc: 'Standardized retrieval & generation pipeline evaluation using {framework}. Measured across {count} source-backed questions, out-of-scope queries, and multi-session simulated student runs.',
    allBenchmarksPassed: 'All Benchmarks Passed',
    tabRagasMetrics: 'RAGAS Metrics (Retrieval & Generation)',
    tabSimulatedProfiles: 'Simulated Student Multi-Session Profiles',
    tabTestCases: 'Adversarial & Grounded Test Cases',
    targetLabel: 'Target:',
    sessionsRunLabel: 'Sessions Run:',
    queryLabel: 'Query:',
    expectedResponse: 'Expected Response:',
    resultLabel: 'Result:',

    // System Settings
    settingsTitle: 'Model Configuration & API Integration',
    settingsDesc: 'Connect live Google Gemini API endpoints, adjust grounding strictness, and tune companion persona.',
    geminiApiKeyLabel: 'Google Gemini API Key',
    getFreeKey: 'Get API Key from Google AI Studio',
    apiKeyNote: 'Note: When no API key is set, the application operates in Grounded Core Mode with comprehensive, pre-extracted MIT 6.824 & Stanford CS224N course citations and Bayesian Knowledge Tracing.',
    modelProvider: 'Gemini Model Provider:',
    languagePref: 'Language Preference:',
    tutorStyle: 'AI Tutor Pedagogical Style:',
    strictSyllabusGrounding: 'Strict Syllabus Grounding',
    refuseOutOfScope: 'Refuse out-of-scope queries',
    resetCacheBtn: 'Reset Cache & History',
    saveSettingsBtn: 'Save System Settings',
    settingsSaved: 'Settings Saved!',

    // Modals
    groundingVerifTitle: 'Grounding Source Verification',
    exactOriginVerified: 'Exact Origin Verified',
    locationTag: 'Location Tag:',
    jumpedToTimestamp: 'Jumped directly to timestamp',
    multimodalTimestampDesc: 'Multimodal timestamp synchronizer extracted lecture audio and slide canvas frames.',
    extractedFigureTitle: 'Multimodal Extracted Figure',
    verbatimGroundingText: 'Verbatim Grounding Text',
    directIngestionMatch: '(Direct Ingestion Match)',
    groundingIntegrity: 'Source Grounding Integrity:',
    faithful100: '100% Faithful',
    btnClose: 'Close',

    // Diagnostic Modal
    newLearnerOnboarding: 'New Learner Onboarding',
    intakeDiagnosticTitle: 'Diagnostic Intake Assessment',
    nextQuestion: 'Next Question',
    completeCalibration: 'Complete Calibration',
    learnerProfileCalibrated: 'Learner Profile Calibrated',
    baselineMasteryScore: 'Baseline Mastery: {score}%',
    diagnosticSuccessDesc: 'Your Bayesian Knowledge Tracing prior probabilities have been initialized. The AI Tutor and Adaptive Assessments are now tuned to your skill level.',
    adaptiveRecTitle: 'Adaptive Recommendation:',
    continueToApp: 'Continue to Study Companion',

    // Setup Wizard Modal
    setupConfigTitle: 'Setup Configuration',
    setupWizardTitle: 'AI Study Companion System Setup',
    selectActiveCourse: 'Select Active Course Knowledge Base',
    applySetupBtn: 'Apply Setup & Start',
    cancelBtn: 'Cancel'
  },

  hi: {
    // Brand & Header
    appTitle: 'एआई अध्ययन साथी (AI Study Companion)',
    appSubtitle: 'मल्टीमॉडल स्रोत-आधारित शिक्षण एवं अनुकूली बीकेटी इंजन',
    trackDBadge: 'ट्रैक D',
    activeSubject: 'सक्रिय विषय',
    switchKnowledgeBase: 'ज्ञान आधार बदलें',
    intakeDiagnostic: 'प्रवेश नैदानिक परीक्षण',
    diagnosticCalibrated: 'नैदानिक कैलिब्रेटेड',
    bktMastery: 'बीकेटी दक्षता',
    geminiLive: 'जेमिनी 1.5 लाइव',
    groundedCore: 'आधारित कोर',
    languageEnglish: 'English (अंग्रेज़ी)',
    languageHindi: 'हिन्दी (Hindi)',
    languageHinglish: 'हिंग्लिश (Hinglish)',

    // Sidebar Navigation
    navDashboard: 'शिक्षार्थी डैशबोर्ड',
    navIngestion: 'मल्टीमॉडल समावेशन',
    navTutor: 'आधारित एआई ट्यूटर',
    navAudio: 'ऑडियो ट्यूटर रूम',
    navAssessments: 'अनुकूली मूल्यांकन',
    navFlowMap: 'विज़ुअल कोर्स प्रवाह',
    navRevision: 'लक्षित पुनरीक्षण',
    navEvaluation: 'सिस्टम बेंचमार्क',
    navSettings: 'सेटअप और मॉडल कॉन्फ़िग',
    navigationModules: 'नेविगेशन मॉड्यूल',
    activeStreak: 'सक्रिय स्ट्रीक',
    days: 'दिन',
    modelTuned: 'मॉडल कैलिब्रेटेड',
    diagnosticPending: 'नैदानिक परीक्षण लंबित',

    // Dashboard
    bktActiveBadge: 'बायेसियन नॉलेज ट्रेसिंग (BKT) सक्रिय',
    trackDReq4: 'ट्रैक D आवश्यकता 4',
    dashboardTitle: 'शिक्षार्थी मॉडल और अनुकूली दक्षता',
    dashboardDesc: 'आपकी व्यक्तिगत सीखने की प्रगति प्रत्येक क्विज़, चैट संवाद और फ्लैशकार्ड समीक्षा के बाद लगातार अपडेट होती है। दक्षता का अनुमान संभाव्य संज्ञानात्मक मॉडलिंग (BKT) द्वारा लगाया जाता है।',
    initCalibNeeded: 'प्रारंभिक कैलिब्रेशन आवश्यक',
    initCalibDesc: 'अपने आधारभूत विषय ज्ञान को कैलिब्रेट करने के लिए 3 मिनट का प्रवेश परीक्षण लें।',
    startDiagnosticBtn: 'नैदानिक परीक्षण शुरू करें',
    priorProbInit: 'प्रारंभिक संभावनाएं प्रारंभ की गईं',
    overallBktMastery: 'कुल बीकेटी दक्षता',
    thisWeekGain: '+8.4% इस सप्ताह',
    strongestConcept: 'मजबूत संकल्पना',
    safeFromForgetting: 'विस्मृति से सुरक्षित',
    retention: 'स्मरण दर',
    targetedWeakTopic: 'लक्षित कमजोर विषय',
    needsReview: 'पुनरावलोकन आवश्यक',
    activeFocusStreak: 'सक्रिय अध्ययन स्ट्रीक',
    totalStudyHours: 'कुल 3.4 घंटे',
    nextExamTarget: 'अगली परीक्षा का लक्ष्य: 12 दिन',
    perTopicMastery: 'विषयवार अंतर्निहित दक्षता अनुमान (BKT)',
    updatedLive: 'P(L) लाइव अपडेट',
    adaptiveNextAction: 'अनुकूली अगला कदम',
    recommendedSteps: 'अनुशंसित चरण:',
    launchPracticeBtn: 'कमजोर विषयों पर अभ्यास शुरू करें',
    reviewFlashcardsBtn: 'लक्षित फ्लैशकार्ड की समीक्षा करें',

    // Ingestion
    ingestionBadge: 'मल्टीमॉडल ज्ञान समावेशन पाइपलाइन',
    trackDReq1: 'ट्रैक D आवश्यकता 1',
    ingestionTitle: 'एकीकृत पाठ्यक्रम सामग्री एवं स्रोत लिंकेज',
    ingestionDesc: 'बिना किसी मैन्युअल पूर्व-प्रसंस्करण के व्याख्यान वीडियो, पाठ्यपुस्तकें और स्लाइड डेक शामिल करें। साथी सूत्रों, आकृतियों, आरेखों को निकालता है और प्रत्येक अवधारणा को उसके मूल स्रोत (पृष्ठ संख्या, स्लाइड या वीडियो टाइमस्टैम्प) से जोड़ता है।',
    btnIngestVideo: 'वीडियो जोड़ें',
    btnIngestPdf: 'पीडीएफ जोड़ें',
    btnIngestSlides: 'स्लाइड्स जोड़ें',
    filterAll: 'सभी सामग्री',
    filterVideos: 'वीडियो',
    filterTextbooks: 'पाठ्यपुस्तकें एवं शोधपत्र',
    filterSlides: 'स्लाइड्स',
    searchPlaceholder: 'समावेशित स्रोतों और अवधारणाओं को खोजें...',
    statusIndexed: 'इंडेक्स किया गया',
    inspectOriginLink: 'मूल लिंक और उद्धरण देखें',
    extractedFiguresTitle: 'निकाले गए मल्टीमॉडल आंकड़े, आरेख और आर्किटेक्चर स्कीमा',
    extractedFiguresSubtitle: 'दृश्य प्रश्न उत्तर के लिए संरक्षित',

    // Tutor Chat
    tutorTitle: 'स्रोत-आधारित एआई ट्यूटर',
    syllabusGroundedBadge: '100% पाठ्यक्रम आधारित',
    tutorSubtitle: 'उत्तर उद्धृत पाठ्यपुस्तक पृष्ठों, व्याख्यान वीडियो टाइमस्टैम्प और स्लाइड्स द्वारा समर्थित हैं।',
    clearChat: 'हटाएं',
    askCompanionHeader: 'अपने एआई अध्ययन साथी से पूछें',
    askCompanionSub: 'ट्यूटर केवल आपके शामिल पाठ्यक्रम से उत्तर देता है: {course}। असमर्थित प्रश्नों को ध्वजांकित किया जाएगा।',
    suggestedQuestions: 'सुझाए गए प्रश्न:',
    outsideCourseScope: 'पाठ्यक्रम के दायरे से बाहर:',
    outsideCourseDesc: 'यह प्रश्न आपकी पाठ्यपुस्तकों, स्लाइड्स या व्याख्यान वीडियो में शामिल नहीं है।',
    citedSourcesHeader: 'उद्धृत स्रोत एवं मूल लिंक:',
    synthesizingMsg: 'स्रोत-आधारित स्पष्टीकरण और सटीक उद्धरण तैयार किए जा रहे हैं...',
    inputPlaceholder: '{course} पर आधारित प्रश्न पूछें...',
    btnAskTutor: 'ट्यूटर से पूछें',
    speechTitle: 'स्पष्टीकरण सुनें (वेब स्पीच ऑडियो)',
    copyTitle: 'स्पष्टीकरण कॉपी करें',

    // Audio Room
    audioRoomBadge: 'इंटरैक्टिव ऑडियो ट्यूटर कक्ष',
    trackDEnhancement6: 'ट्रैक D संवर्द्धन 6d और 6e',
    audioTitle: 'लक्षित ऑडियो संक्षिप्तियां एवं द्विभाषी शिक्षण',
    audioDesc: 'एआई स्पीच सिंथेसिस के साथ हैंड्स-फ्री श्रवण पुनरीक्षण। गहरी वैचारिक समझ के लिए मानक अंग्रेजी व्याख्यानों और हिंग्लिश/हिन्दी व्याख्याओं के बीच टॉगल करें।',
    hinglishMode: 'हिंग्लिश मोड:',
    enabled: 'सक्रिय',
    disabled: 'निष्क्रिय',
    availableAudioBriefs: 'उपलब्ध पुनरीक्षण ऑडियो संक्षिप्तियां',
    nowPlaying: 'वर्तमान में बज रहा है:',
    sourceVerifiedBrief: 'स्रोत-सत्यापित ऑडियो संक्षेप',
    groundedIn: 'स्रोत आधार:',
    liveTranscript: 'लाइव ऑडियो प्रतिलेख (Transcript)',
    spokenPct: 'बोला गया',
    voiceEngine: 'वॉयस इंजन: ब्राउज़र वेब स्पीच एपीआई',
    playAudioBrief: 'ऑडियो संक्षेप चलाएं',
    pauseAudioBrief: 'ऑडियो सत्र रोकें',

    // Assessments
    assessmentBadge: 'अनुकूली मूल्यांकन जनरेटर',
    trackDReq3: 'ट्रैक D आवश्यकता 3',
    assessmentTitle: 'क्यूरेटेड स्कोप एवं मल्टीमॉडल परीक्षा इंजन',
    assessmentDesc: 'बहुविकल्पीय (MCQ), वैचारिक लघु उत्तरीय और संख्यात्मक गणनाओं वाली कस्टम परीक्षाएं बनाएं। प्रत्येक प्रश्न एक स्रोत स्थान से जुड़ा है और गलतफहमियों के विरुद्ध सत्यापित है।',
    launchQuizBtn: 'अनुकूली क्विज़ प्रारंभ करें',
    configScope: 'मूल्यांकन स्कोप कॉन्फ़िगर करें',
    targetTopic: 'लक्षित विषय / डोमेन:',
    fullSyllabus: 'संपूर्ण पाठ्यक्रम (सभी विषय)',
    difficultyLevel: 'कठिनाई स्तर:',
    diffAdaptive: 'अनुकूली (मिश्रित कठिनाई)',
    diffBeginner: 'शुरुआती (मूलभूत)',
    diffIntermediate: 'मध्यवर्ती (मुख्य सिद्धांत)',
    diffAdvanced: 'उन्नत (प्रमाण और जटिल मामले)',
    questionFormat: 'प्रश्न प्रारूप:',
    formatAll: 'सभी प्रारूप (MCQ, लघु उत्तरीय, संख्यात्मक)',
    formatMCQ: 'बहुविकल्पीय प्रश्न (MCQ)',
    formatShort: 'वैचारिक लघु उत्तर',
    formatNumerical: 'संख्यात्मक और कोरम गणना',
    totalQuestionsLabel: 'कुल प्रश्न:',
    qualityTitle: 'सत्यापन और गुणवत्ता',
    crossModelVal: 'क्रॉस-मॉडल उत्तर सत्यापन: सभी उत्तर कुंजियों को पाठ्यक्रम के औपचारिक प्रमाणों के विरुद्ध सत्यापित किया जाता है।',
    noveltyGuarantee: 'नवीनता गारंटी: सत्रों में सिमेंटिक हैशिंग का उपयोग करके प्रश्नों के दोहराव से बचा जाता है।',
    citedFeedbackGuarantee: 'उद्धृत अंश प्रतिक्रिया: प्रत्येक उत्तर सीधे पृष्ठ, स्लाइड या वीडियो टाइमस्टैम्प प्रतिक्रिया प्रदान करता है।',
    questionsReadyInPool: 'प्रश्न पूल में तैयार हैं',

    // Quiz Runner
    exitAssessment: 'मूल्यांकन से बाहर निकलें',
    questionNav: 'प्रश्न {current} / {total}',
    bktCalibratedItem: 'बीकेटी कैलिब्रेटेड प्रश्न',
    formulaHint: 'सूत्र संकेत:',
    verifyAnswerBtn: 'उत्तर सत्यापित करें',
    nextQuestionBtn: 'अगला प्रश्न',
    viewReportBtn: 'मूल्यांकन रिपोर्ट देखें',
    correctAnswerMsg: 'सही उत्तर! बीकेटी दक्षता अपडेट की गई (+12%)',
    incorrectAnswerMsg: 'गलत उत्तर। नीचे उद्धृत स्रोत सिद्धांत की समीक्षा करें।',
    verifyInSource: '{source} ({location}) में सत्यापित करें',

    // Assessment Report
    postAssessmentBadge: 'मूल्यांकन-उपरांत विश्लेषण रिपोर्ट',
    trackDReq3c: 'ट्रैक D आवश्यकता 3c',
    masteryAdvanced: 'दक्षता में सुधार हुआ! 🎉',
    gapsIdentified: 'कमजोरियों की पहचान की गई',
    reportDesc: 'सभी मूल्यांकित विषय नोड्स पर गुप्त दक्षता मापदंडों की पुनर्गणना करने के लिए आपकी प्रतिक्रियाओं को बायेसियन नॉलेज ट्रेसिंग (BKT) के माध्यम से संसाधित किया गया था।',
    finalScore: 'अंतिम स्कोर',
    correctLabel: 'सही:',
    timeTaken: 'समय लगा:',
    weakTopicsTitle: 'पहचाने गए कमजोर विषय और गलतफहमियां',
    weakTopicsDesc: 'शिक्षार्थी मॉडल ने निम्नलिखित विषयों में वैचारिक कमियों की पहचान की:',
    needsTargetedReview: 'लक्षित पुनरावलोकन आवश्यक',
    likelyMisconception: 'संभावित गलतफहमी: विभिन्न पदों पर लीडर प्रतिबद्धता सिद्धांतों या नेटवर्क विभाजन के दौरान कोरम गणना में भ्रम।',
    noMisconceptionsTitle: 'कोई गंभीर गलतफहमी नहीं मिली!',
    noMisconceptionsDesc: 'आपने सभी मूल्यांकित पाठ्यक्रम अनुभागों में मजबूत समझ का प्रदर्शन किया।',
    generateFlashcardsBtn: 'स्पेसड रिपीटिशन फ्लैशकार्ड उत्पन्न करें',
    bktCalibrationShift: 'बायेसियन नॉलेज ट्रेसिंग अपडेट',
    bktRecalculatedDesc: 'स्लिप रेट (S=0.10) और ट्रांज़िशन रेट (T=0.15) का उपयोग करके वास्तविक समय में अपडेट किए गए विषयवार गुप्त संभाव्यता अनुमान P(L):',
    retakeScopeBtn: 'पुनः प्रयास करें',
    audioBriefBtn: 'ऑडियो संक्षेप',

    // Course Flow Map
    flowMapBadge: 'विज़ुअल नॉलेज ग्राफ एवं प्रवाह मानचित्र',
    flowMapTitle: 'पाठ्यक्रम पूर्वापेक्षा एवं निर्भरता प्रवाह',
    flowMapDesc: 'पाठ्यक्रम अवधारणाओं और पूर्वापेक्षा श्रृंखलाओं का इंटरैक्टिव संरचनात्मक निर्देशित ग्राफ (DAG)। जटिल सर्वसम्मति प्रोटोकॉल को अनलॉक करने के लिए मूलभूत प्रिमिटिव में महारत हासिल करें।',
    statusMastered: 'महारत हासिल (Mastered)',
    statusInProgress: 'प्रगति पर (In Progress)',
    statusLocked: 'अवरुद्ध (Locked)',
    interactivePrereqGraph: 'इंटरैक्टिव पूर्वापेक्षा ग्राफ',
    nodeRequiresPrereq: 'पूर्वापेक्षाएँ आवश्यक',
    clickNodeHint: 'पूर्वापेक्षाओं, निकाली गई अवधारणाओं का निरीक्षण करने, या अभ्यास पर जाने के लिए किसी भी नोड पर क्लिक करें।',
    topicInspector: 'विषय निरीक्षक',
    keyInvariants: 'मुख्य सिद्धांत एवं अवधारणाएं:',
    prereqDependencies: 'पूर्वापेक्षा निर्भरताएँ:',
    noneFoundational: 'कोई नहीं (मूलभूत रूट नोड)',
    askTutorAboutTopic: 'ट्यूटर से इस विषय के बारे में पूछें',
    testTopicInQuiz: 'इस विषय का क्विज़ लें',

    // Revision Flashcards
    srBadge: 'लक्षित स्पेसड रिपीटिशन इंजन',
    flashcardsTitle: 'लक्षित फ्लैशकार्ड एवं विस्मृति वक्र अनुसूची',
    flashcardsDesc: 'आपके कमजोर विषयों और मूल्यांकन की गलतफहमियों से सीधे तैयार किए गए स्वचालित फ्लैशकार्ड डेक। परीक्षा के दिन से पहले स्मृति को मजबूत करने के लिए एबिंगहॉस विस्मृति वक्र अंतराल का उपयोग करता है।',
    examInDays: 'परीक्षा तिथि: {days} दिनों में',
    srScheduleTuned: 'स्पेसड रिपीटिशन शेड्यूल अनुकूलित',
    cardNav: 'कार्ड {current} / {total}',
    questionPromptClick: 'प्रश्न संकेत (उलटने के लिए क्लिक करें)',
    citedExplanationBack: 'उद्धृत सिद्धांत स्पष्टीकरण (पीछे)',
    howWellDidYouKnow: 'आप इस सिद्धांत को कितनी अच्छी तरह जानते थे?',
    clickCardToReveal: 'समाधान देखने के लिए ऊपर कार्ड पर क्लिक करें',
    btnAgain: 'फिर से (1 दिन)',
    btnGood: 'अच्छा (3 दिन)',
    btnEasy: 'आसान (7 दिन)',
    forgettingCurveTitle: 'विस्मृति वक्र पूर्वानुमान',
    forgettingCurveDesc: 'आपकी परीक्षा से पहले याददाश्त की गारंटी के लिए R = e^(-t/S) क्षय मॉडलिंग से निर्मित लक्षित पुनरीक्षण अनुसूची:',
    todayPriority: 'आज (पहला दिन)',
    priorityHigh: 'उच्च प्राथमिकता',
    spacedBoost: 'दिन 4 (स्पेसड बूस्ट)',
    preExamLock: 'दिन 10 (प्री-एग्जाम लॉक)',
    srGuarantee: 'स्पेसड रिपीटिशन एल्गोरिथ्म यह सुनिश्चित करता है कि आप केवल 15 मिनट के दैनिक अभ्यास से 90%+ पाठ्यक्रम कवरेज बनाए रखें।',

    // System Benchmarks
    benchmarksBadge: 'स्वचालित पाइपलाइन बेंचमार्किंग',
    benchmarksTitle: 'सिस्टम मूल्यांकन एवं फ्रेमवर्क बेंचमार्क',
    benchmarksDesc: '{framework} का उपयोग करके मानकीकृत पुनर्प्राप्ति और उत्पादन पाइपलाइन मूल्यांकन। {count} स्रोत-समर्थित प्रश्नों, दायरे से बाहर के प्रश्नों और बहु-सत्र सिम्युलेटेड छात्र परीक्षणों में मापा गया।',
    allBenchmarksPassed: 'सभी बेंचमार्क उत्तीर्ण हुए',
    tabRagasMetrics: 'रागास (RAGAS) मेट्रिक्स (पुनर्प्राप्ति एवं उत्पादन)',
    tabSimulatedProfiles: 'सिम्युलेटेड छात्र बहु-सत्र प्रोफाइल',
    tabTestCases: 'प्रतिकूल एवं स्रोत-आधारित परीक्षण मामले',
    targetLabel: 'लक्ष्य:',
    sessionsRunLabel: 'सत्र चलाए गए:',
    queryLabel: 'प्रश्न:',
    expectedResponse: 'अपेक्षित प्रतिक्रिया:',
    resultLabel: 'परिणाम:',

    // System Settings
    settingsTitle: 'मॉडल कॉन्फ़िगरेशन एवं एपीआई एकीकरण',
    settingsDesc: 'लाइव गूगल जेमिनी एपीआई एंडपॉइंट्स कनेक्ट करें, ग्राउंडिंग की कठोरता समायोजित करें, और साथी की शैली को अनुकूलित करें।',
    geminiApiKeyLabel: 'गूगल जेमिनी एपीआई कुंजी (Google Gemini API Key)',
    getFreeKey: 'गूगल एआई स्टूडियो से निःशुल्क कुंजी प्राप्त करें',
    apiKeyNote: 'नोट: जब कोई एपीआई कुंजी सेट नहीं होती है, तो एप्लिकेशन व्यापक, पूर्व-निकाले गए एमआईटी 6.824 और स्टैनफोर्ड CS224N पाठ्यक्रम उद्धरणों और बायेसियन नॉलेज ट्रेसिंग के साथ ग्राउंडेड कोर मोड में संचालित होता है।',
    modelProvider: 'जेमिनी मॉडल प्रदाता:',
    languagePref: 'भाषा प्राथमिकता:',
    tutorStyle: 'एआई ट्यूटर शिक्षण शैली:',
    strictSyllabusGrounding: 'सख्त पाठ्यक्रम ग्राउंडिंग',
    refuseOutOfScope: 'पाठ्यक्रम से बाहर के प्रश्नों को अस्वीकार करें',
    resetCacheBtn: 'कैश और इतिहास रीसेट करें',
    saveSettingsBtn: 'सिस्टम सेटिंग्स सहेजें',
    settingsSaved: 'सेटिंग्स सहेजी गईं!',

    // Modals
    groundingVerifTitle: 'ग्राउंडिंग स्रोत सत्यापन',
    exactOriginVerified: 'सटीक मूल स्रोत सत्यापित',
    locationTag: 'स्थान टैग:',
    jumpedToTimestamp: 'सीधे टाइमस्टैम्प पर ले जाया गया',
    multimodalTimestampDesc: 'मल्टीमॉडल टाइमस्टैम्प सिंक्रोनाइज़र ने व्याख्यान ऑडियो और स्लाइड कैनवास फ्रेम निकाले।',
    extractedFigureTitle: 'मल्टीमॉडल निकाला गया आंकड़ा',
    verbatimGroundingText: 'मूल उद्धरण पाठ',
    directIngestionMatch: '(प्रत्यक्ष समावेशन मिलान)',
    groundingIntegrity: 'स्रोत ग्राउंडिंग अखंडता:',
    faithful100: '100% विश्वसनीय',
    btnClose: 'बंद करें',

    // Diagnostic Modal
    newLearnerOnboarding: 'नए शिक्षार्थी का ऑनबोर्डिंग',
    intakeDiagnosticTitle: 'नैदानिक प्रवेश मूल्यांकन',
    nextQuestion: 'अगला प्रश्न',
    completeCalibration: 'कैलिब्रेशन पूरा करें',
    learnerProfileCalibrated: 'शिक्षार्थी प्रोफाइल कैलिब्रेट किया गया',
    baselineMasteryScore: 'आधारभूत दक्षता: {score}%',
    diagnosticSuccessDesc: 'आपकी बायेसियन नॉलेज ट्रेसिंग प्रारंभिक संभावनाएं प्रारंभ कर दी गई हैं। एआई ट्यूटर और अनुकूली मूल्यांकन अब आपके कौशल स्तर के अनुसार तैयार हैं।',
    adaptiveRecTitle: 'अनुकूली सिफारिश:',
    continueToApp: 'अध्ययन साथी पर जारी रखें',

    // Setup Wizard Modal
    setupConfigTitle: 'सेटअप कॉन्फ़िगरेशन',
    setupWizardTitle: 'एआई अध्ययन साथी सिस्टम सेटअप',
    selectActiveCourse: 'सक्रिय पाठ्यक्रम ज्ञान आधार का चयन करें',
    applySetupBtn: 'सेटअप लागू करें और शुरू करें',
    cancelBtn: 'रद्द करें'
  }
};

/**
 * Hindi Course Content Translations (Topics, Questions, Flashcards)
 */
export const HINDI_COURSE_CONTENT = {
  topics: {
    'topic-raft-consensus': {
      title: 'राफ्ट आम सहमति प्रोटोकॉल (Raft Consensus)',
      description: 'विभाजित नेटवर्क में लीडर चुनाव, लॉग प्रतिकृति और सुरक्षा अपरिवर्तनीयता।',
      keyConcepts: ['हार्टबीट टाइमआउट', 'विभाजित वोट', 'लॉग मिलान गुण', 'कमिट इंडेक्स नियम']
    },
    'topic-rpc-state': {
      title: 'आरपीसी एवं प्रतिकृत स्टेट मशीनें (RPC & State Machines)',
      description: 'अधिकतम-एक-बार शब्दार्थ, स्टेट मशीन दोहराव और नियतात्मक निष्पादन।',
      keyConcepts: ['इडेम्पोटेंसी', 'क्लाइंट डुप्लिकेट', 'नियतात्मक संक्रमण', 'लॉग रीप्ले']
    },
    'topic-byzantine-faults': {
      title: 'बीजान्टिन दोष सहिष्णुता (Byzantine Fault Tolerance)',
      description: 'दुर्भावनापूर्ण नोड्स को संभालना, PBFT 3f+1 नोड आवश्यकताएं और क्रिप्टोग्राफ़िक हस्ताक्षर।',
      keyConcepts: ['3f+1 कोरम', 'प्री-प्रिपेयर और प्रिपेयर चरण', 'व्यू परिवर्तन', 'डिजिटल हस्ताक्षर']
    },
    'topic-vector-clocks': {
      title: 'लॉजिकल घड़ियाँ और कार्य-कारण (Logical Clocks & Causality)',
      description: 'लैम्पॉर्ट टाइमस्टैम्प, आंशिक बनाम पूर्ण क्रमबद्धता और वेक्टर क्लॉक समवर्ती पहचान।',
      keyConcepts: ['घटित-पहले संबंध (->)', 'समवर्ती घटनाएं', 'कार्य-कारण संगति', 'संस्करण वैक्टर']
    },
    'topic-cap-theorem': {
      title: 'सीएपी प्रमेय और अंतिम संगति (CAP Theorem)',
      description: 'नेटवर्क विभाजन में संगति (Consistency), उपलब्धता (Availability) और विभाजन सहिष्णुता के बीच संतुलन।',
      keyConcepts: ['नेटवर्क विभाजन', 'PACELC प्रमेय', 'रीड रिपेयर', 'CRDTs']
    },
    'topic-self-attention': {
      title: 'स्केल्ड डॉट-प्रोडक्ट सेल्फ-अटेंशन',
      description: 'क्वेरी, की, वैल्यू मैट्रिक्स अनुमान और sqrt(d_k) द्वारा सॉफ्टमैक्स स्केलिंग।',
      keyConcepts: ['सॉफ्टमैक्स अटेंशन', 'वर्गमूल स्केलिंग', 'क्रमचय समरूपता', 'जटिलता O(N^2)']
    },
    'topic-multi-head': {
      title: 'मल्टी-हेड अटेंशन और प्रोजेक्शन',
      description: 'विभिन्न स्थितियों में विभिन्न प्रतिनिधित्व उप-स्थानों से जानकारी पर संयुक्त ध्यान देना।',
      keyConcepts: ['h समानांतर अटेंशन हेड', 'रैखिक प्रक्षेपण W_O', 'उप-स्थान पृथक्करण']
    },
    'topic-positional-enc': {
      title: 'पोजिशनल एन्कोडिंग (RoPE और सिनुसॉइडल)',
      description: 'फूरियर आवृत्तियों और रोटरी स्थिति एम्बेडिंग का उपयोग करके टोकन क्रम जानकारी जोड़ना।',
      keyConcepts: ['सिनुसॉइडल सूत्र', 'RoPE जटिल रोटेशन', 'सापेक्ष बनाम निरपेक्ष स्थिति']
    },
    'topic-vision-transformers': {
      title: 'विज़न ट्रांसफॉर्मर (ViT)',
      description: 'पैच एम्बेडिंग, [CLS] टोकन टोकनाइज़ेशन और सीएनएन से भिन्न आगमनात्मक पूर्वाग्रह।',
      keyConcepts: ['पैच निष्कर्षण (16x16)', 'समतल पैच का रैखिक प्रक्षेपण', 'स्थानिक अनुवाद पूर्वाग्रह का अभाव']
    }
  },
  questions: {
    'q-raft-1': {
      question: 'राफ्ट आम सहमति एल्गोरिथ्म (Raft) में, लीडर चुनाव के दौरान अनिश्चितकालीन विभाजित वोटों (Split Votes) को कैसे रोका जाता है?',
      options: [
        'सर्वर आईडी के आधार पर निश्चित प्राथमिकता क्रम का उपयोग करके',
        'एक निश्चित सीमा (उदा. 150ms-300ms) में यादृच्छिक चुनाव टाइमआउट (Randomized Timeouts) चुनकर',
        'तुरंत बाहरी ज़ूकीपर सेवा को अनुरोध अग्रेषित करके',
        'नेटवर्क हार्टबीट दर को 1 मिलीसेकंड तक बढ़ाकर'
      ],
      explanation: 'यादृच्छिक चुनाव टाइमआउट सर्वरों को अलग-अलग समय पर जगाते हैं ताकि लगभग सभी मामलों में केवल एक उम्मीदवार का समय समाप्त हो और वह दूसरों से पहले बहुमत वोट जुटा ले।'
    },
    'q-raft-2': {
      question: 'किस परिस्थिति में राफ्ट लीडर सुरक्षित रूप से किसी पिछले पद (Prior Term) की प्रविष्टि को अपनी स्टेट मशीन में कमिटेड मान सकता है?',
      options: [
        'जैसे ही सर्वरों का बहुमत उस पिछली प्रविष्टि की प्राप्ति स्वीकार करता है',
        'वह केवल प्रतियों की गिनती करके पिछले पद की प्रविष्टियों को सीधे कमिट नहीं कर सकता; उसे अपने वर्तमान पद की एक प्रविष्टि को बहुमत द्वारा कमिट करना होगा',
        'क्लाइंट राइट अनुरोध प्राप्त होते ही तुरंत',
        'जब भी लीडर का पद सभी फॉलोअर पदों से बड़ा हो'
      ],
      explanation: 'राफ्ट शोधपत्र का चित्र 8 यह दर्शाता है कि लीडर यह निष्कर्ष नहीं निकाल सकता कि पहले के पद की प्रविष्टि कमिटेड है केवल इसलिए कि वह बहुमत पर मौजूद है। लीडर को अपने वर्तमान पद की एक प्रविष्टि को बहुमत तक दोहराना अनिवार्य है।'
    },
    'q-raft-num-1': {
      question: 'अधिकतम f = 4 दुर्भावनापूर्ण (Byzantine) नोड्स को सहन करने के लिए PBFT क्लस्टर में आवश्यक न्यूनतम नोड्स (N) की कुल संख्या क्या है?',
      hint: 'मानक बीजान्टिन सर्वसम्मति कोरम सूत्र का उपयोग करें: N >= 3f + 1।',
      explanation: 'f विफल या गद्दार नोड्स के साथ बीजान्टिन दोष सहिष्णुता के लिए, यह सुनिश्चित करने के लिए N >= 3f + 1 नोड्स की आवश्यकता होती है कि गैर-दोषपूर्ण नोड्स किसी भी कोरम का सख्त बहुमत बनाते हैं। अतः N = 3(4) + 1 = 13 नोड्स।'
    },
    'q-vector-1': {
      question: '3-नोड वितरित प्रणाली में दो घटनाओं A और B के वेक्टर टाइमस्टैम्प V(A) = [2, 1, 0] और V(B) = [1, 3, 0] दिए गए हैं। बताएं कि क्या घटना A, B से पहले हुई, B, A से पहले हुई, या वे समवर्ती (Concurrent) हैं।',
      sampleModelAnswer: 'घटनाएं A और B समवर्ती हैं (A || B)। क्योंकि V(A) में प्रक्रिया 1 पर मान अधिक है (2 > 1) जबकि V(B) में प्रक्रिया 2 पर मान अधिक है (3 > 1), न तो V(A) <= V(B) और न ही V(B) <= V(A) मान्य है।'
    },
    'q-trans-1': {
      question: 'ट्रांसफॉर्मर में स्केल्ड डॉट-प्रोडक्ट अटेंशन तंत्र में डॉट उत्पादों को 1 / sqrt(d_k) से स्केल क्यों किया जाता है?',
      options: [
        'बड़े d_k के लिए डॉट उत्पादों को परिमाण में बहुत बड़ा होने से रोकने के लिए, जो सॉफ्टमैक्स को अत्यंत छोटे ग्रेडिएंट वाले क्षेत्रों में धकेलता है',
        'क्वेरी और की प्रोजेक्शन मैट्रिसेस के पैरामीटर काउंट को कम करने के लिए',
        'यह सुनिश्चित करने के लिए कि आउटपुट वेक्टर का माध्य शून्य और भिन्नता इकाई हो',
        'प्रशिक्षण के दौरान अटेंशन वेक्टर की दिशा को उलटने के लिए'
      ],
      explanation: 'जब d_k बड़ा होता है, तो डॉट उत्पाद परिमाण में बड़े हो जाते हैं, जिससे सॉफ्टमैक्स फ़ंक्शन में ग्रेडिएंट लुप्त (vanishing gradient) हो जाते हैं। sqrt(d_k) से विभाजित करने पर ग्रेडिएंट प्रवाह स्थिर हो जाता है।'
    },
    'q-trans-num-1': {
      question: 'मॉडल आयाम d_model = 768 और h = 12 समानांतर अटेंशन हेड वाले ट्रांसफॉर्मर मॉडल में, प्रत्येक अलग हेड का आयाम d_k क्या होगा?',
      hint: 'd_k = d_model / h',
      explanation: 'प्रत्येक हेड d_k = d_model / h = 768 / 12 = 64 आयाम के उप-स्थान पर कार्य करता है। अतः 768 / 12 = 64 आयाम।'
    }
  },
  diagnosticQuestions: [
    {
      question: 'जब नेटवर्क पैकेट डुप्लिकेट होते हैं तो "अधिकतम-एक-बार" (At-most-once) RPC शब्दार्थ क्या गारंटी देता है?',
      options: [
        'सर्वर दूरस्थ कॉल को बिल्कुल शून्य या एक बार निष्पादित करता है, डुप्लिकेट निष्पादन को अनदेखा करता है।',
        'सर्वर क्रैश होने तक क्लाइंट अनिश्चित काल तक अनुरोध दोबारा भेजता रहता है।',
        'क्लस्टर के सभी सर्वर तुरंत रीबूट हो जाते हैं।',
        'संदेश स्वचालित रूप से यूडीपी पैकेट में बदल जाते हैं।'
      ]
    },
    {
      question: 'राफ्ट लीडर द्वारा फॉलोअर्स को भेजे जाने वाले हार्टबीट RPC की प्राथमिक भूमिका क्या है?',
      options: [
        'फॉलोअर चुनाव टाइमर को रीसेट करना और चुनाव शुरू किए बिना लीडर का अधिकार बनाए रखना।',
        'निष्क्रिय वर्कर थ्रेड्स को बंद करना।',
        'बिलिंग के लिए नेटवर्क राउंड-ट्रिप लेटेंसी को बेंचमार्क करना।',
        'क्लस्टर क्रिप्टोग्राफ़िक सार्वजनिक कुंजी बदलना।'
      ]
    },
    {
      question: 'यदि घटना A, घटना B से पहले हुई (A -> B), तो उनके लैम्पॉर्ट टाइमस्टैम्प L(A) और L(B) के बारे में क्या सत्य है?',
      options: [
        'L(A) < L(B)',
        'L(A) == L(B)',
        'L(A) > L(B)',
        'लैम्पॉर्ट घड़ियाँ इस संबंध को निर्धारित नहीं कर सकती हैं।'
      ]
    }
  ]
};
