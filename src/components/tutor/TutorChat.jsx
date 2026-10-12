import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  CheckCircle, 
  BookOpen, 
  Video, 
  Presentation, 
  FileText, 
  RotateCcw, 
  ExternalLink,
  Bot,
  User,
  Copy,
  Check
} from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { useLanguage } from '../../context/LanguageContext';

export default function TutorChat({ 
  activeCourse, 
  selectedSource,
  chatMessages, 
  onSaveMessages, 
  onOpenCitation, 
  settings 
}) {
  const { t, language, isHindi } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const activeSubjectTitle = selectedSource?.title || activeCourse?.title;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  // Suggested Prompts in English and Hindi
  const suggestedPrompts = isHindi ? [
    'राफ्ट आम सहमति में विभाजित वोटों को कैसे रोका जाता है?',
    'बीजान्टिन दोष सहिष्णुता (PBFT) में 3f + 1 नोड्स की आवश्यकता क्यों होती है?',
    'वेक्टर घड़ियाँ समवर्ती घटनाओं (Concurrent Events) का पता कैसे लगाती हैं?',
    'क्या मैं राफ्ट का उपयोग करके ब्लॉकचेन पर बिटकॉइन खरीद सकता हूँ?' // adversarial test
  ] : selectedSource?.sampleCitations?.length ? [
    `Explain the concept of ${selectedSource.sampleCitations[0]?.title || selectedSource.title}`,
    selectedSource.sampleCitations[1]?.title ? `How does ${selectedSource.sampleCitations[1].title} work?` : `What are the core topics in ${selectedSource.title}?`,
    selectedSource.sampleCitations[2]?.title ? `Summarize ${selectedSource.sampleCitations[2].title}` : `Give me key takeaways from ${selectedSource.title}`,
    'How do I invest in crypto stock options?' // adversarial test
  ] : activeCourse?.id === 'course-deep-learning' ? [
    'Why is scaled dot-product attention scaled by 1/sqrt(d_k)?',
    'How do multi-head attention projections work?',
    'What is the difference between absolute sinusoidal and RoPE embeddings?',
    'How do I invest in crypto stock options?' // adversarial test
  ] : [
    'How does Raft prevent split votes with randomized timeouts?',
    'Why does Byzantine Fault Tolerance (PBFT) require 3f + 1 nodes?',
    'How do Vector Clocks detect concurrent events (A || B)?',
    'Can we use Raft to trade cryptocurrency on the blockchain?' // adversarial test
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    setInputText('');

    // Append student message
    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...chatMessages, userMsg];
    onSaveMessages(updated);
    setIsLoading(true);

    try {
      const response = await GeminiService.askTutor({
        query,
        course: activeCourse,
        selectedSource,
        activeTopic: null,
        chatHistory: updated,
        settings,
        language
      });

      const botMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: response.text,
        grounded: response.grounded,
        isOutsideKnowledge: response.isOutsideKnowledge,
        citations: response.citations || [],
        provider: response.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      onSaveMessages([...updated, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: isHindi 
          ? 'ज्ञान आधार से पूछताछ करते समय त्रुटि हुई। कृपया नेटवर्क कनेक्शन या सेटिंग्स की जांच करें।'
          : 'An error occurred while querying the knowledge base. Please check your network connection or API settings.',
        grounded: false,
        isOutsideKnowledge: false,
        citations: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onSaveMessages([...updated, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-speech for tutoring
  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`>]/g, ''));
      if (isHindi) utterance.lang = 'hi-IN';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Tutor Top Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-100">
                {t('tutorTitle')}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t('syllabusGroundedBadge')}
              </span>
              {selectedSource && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 truncate max-w-[220px]" title={selectedSource.title}>
                  {selectedSource.title}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {selectedSource ? `${t('activeSubject') || 'Active Subject'}: ${selectedSource.title}` : t('tutorSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSaveMessages([])}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{t('clearChat')}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-100">
                {t('askCompanionHeader')}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t('askCompanionSub', { course: activeSubjectTitle })}
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="w-full space-y-2 pt-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-left">
                {t('suggestedQuestions')}
              </div>
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{p}</span>
                  <Send className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatMessages.map((msg, idx) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id || idx}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white ${
                  isUser ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-indigo-400" />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col space-y-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Bubble Content */}
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    
                    {/* Outside Knowledge Banner (Track D requirement) */}
                    {msg.isOutsideKnowledge && (
                      <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                        <div>
                          <span className="font-bold">{t('outsideCourseScope')}</span> {t('outsideCourseDesc')}
                        </div>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {/* Citations Container */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{t('citedSourcesHeader')}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cite, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => onOpenCitation(cite)}
                              className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 hover:bg-indigo-600/30 border border-slate-800 hover:border-indigo-500/50 text-left transition-all text-[11px] group"
                            >
                              {cite.sourceType === 'video' && <Video className="w-3.5 h-3.5 text-red-400" />}
                              {cite.sourceType === 'slides' && <Presentation className="w-3.5 h-3.5 text-amber-400" />}
                              {cite.sourceType === 'textbook' && <FileText className="w-3.5 h-3.5 text-blue-400" />}
                              <div className="truncate max-w-[200px]">
                                <span className="font-semibold text-slate-200 group-hover:text-indigo-300">{cite.sourceName}</span>
                                <span className="text-[10px] text-indigo-400 font-mono ml-1.5">{cite.location}</span>
                              </div>
                              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 ml-1" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Message Meta & Action Buttons */}
                  <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.provider && <span>• {msg.provider}</span>}
                    {!isUser && (
                      <>
                        <button 
                          onClick={() => handleSpeak(msg.text)}
                          className="hover:text-indigo-400 p-0.5 transition-colors"
                          title={t('speechTitle')}
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3 text-amber-400" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                        <button 
                          onClick={() => handleCopy(msg.text, idx)}
                          className="hover:text-indigo-400 p-0.5 transition-colors"
                          title={t('copyTitle')}
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>{t('synthesizingMsg')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input 
            type="text"
            placeholder={t('inputPlaceholder', { course: activeSubjectTitle || 'course' })}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 shadow-inner"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t('btnAskTutor')}</span>
          </button>
        </form>
      </div>

    </div>
  );
}
