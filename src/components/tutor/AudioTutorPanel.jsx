import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Languages, 
  Radio, 
  FileText
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getActiveSubject } from '../../services/subjectService';

export const AUDIO_BRIEFS = [
  {
    id: 'brief-raft',
    title: 'Raft Leader Election & Safety Invariants',
    titleHi: 'राफ्ट लीडर चुनाव और सुरक्षा अपरिवर्तनीयता',
    duration: '2m 15s',
    englishScript: 'In Raft, randomized election timeouts between 150 and 300 milliseconds prevent split votes. When a candidate times out, it increments its term and requests votes from peers. Once it secures a majority, it sends periodic heartbeats to maintain authority.',
    hinglishScript: 'Raft consensus mein split votes ko rokne ke liye randomized election timeouts use hote hain jo 150 se 300 milliseconds ke beech set kiye jaate hain. Jab koi candidate time out hota hai, woh apna term number badha kar peers se votes request karta hai aur majority milte hi heartbeats bhejta hai.',
    hindiScript: 'राफ्ट आम सहमति प्रोटोकॉल में विभाजित वोटों को रोकने के लिए 150 से 300 मिलीसेकंड के बीच यादृच्छिक चुनाव टाइमआउट का उपयोग किया जाता है। जब किसी उम्मीदवार का समय समाप्त होता है, तो वह अपना पद बढ़ाता है और साथियों से वोट मांगता है। बहुमत मिलते ही वह अपना अधिकार बनाए रखने के लिए समय-समय पर हार्टबीट भेजता है।',
    topic: 'Raft Consensus Protocol',
    topicHi: 'राफ्ट आम सहमति प्रोटोकॉल',
    source: 'MIT 6.824 Lecture 03 & Ongaro Raft Paper'
  },
  {
    id: 'brief-pbft',
    title: 'PBFT & The 3f + 1 Quorum Requirement',
    titleHi: 'PBFT और 3f + 1 कोरम आवश्यकता',
    duration: '1m 50s',
    englishScript: 'Why does Byzantine Fault Tolerance require at least 3f plus 1 replicas to tolerate f traitors? If f nodes are malicious and f non-faulty nodes are slow or partitioned, the remaining f plus 1 honest nodes must be enough to reach consensus.',
    hinglishScript: 'Byzantine Fault Tolerance mein f faulty ya malicious nodes ko handle karne ke liye 3f + 1 replicas chahiye hote hain. Agar f nodes corrupt ho jayein aur f nodes network delay ki wajah se unresponsive ho jayein, toh bache hue honest nodes consensus tak pahunch sakte hain.',
    hindiScript: 'बीजान्टिन दोष सहिष्णुता (PBFT) में f गद्दार नोड्स को सहन करने के लिए कम से कम 3f + 1 प्रतियों की आवश्यकता क्यों होती है? यदि f नोड्स दुर्भावनापूर्ण हैं और f ईमानदार नोड्स धीमे या विभाजित हैं, तो शेष f + 1 ईमानदार नोड्स सर्वसम्मति तक पहुंचने के लिए पर्याप्त होने चाहिए।',
    topic: 'Byzantine Fault Tolerance',
    topicHi: 'बीजान्टिन दोष सहिष्णुता',
    source: 'Lecture 06: PBFT & Castro-Liskov Paper'
  },
  {
    id: 'brief-vector-clocks',
    title: 'Vector Clocks & Causality Detection',
    titleHi: 'वेक्टर घड़ियाँ और कार्य-कारण पहचान',
    duration: '2m 05s',
    englishScript: 'Unlike scalar Lamport timestamps that only provide a partial order, Vector Clocks maintain a vector of logical clocks across all processes. If neither vector dominates the other, the events are mathematically concurrent.',
    hinglishScript: 'Vector Clocks har process par ek vector maintain karte hain. Isse hum accurately determine kar sakte hain ki kaunsa event pehle hua ya kya dono events concurrent the.',
    hindiScript: 'अदिश लैम्पॉर्ट टाइमस्टैम्प के विपरीत जो केवल आंशिक क्रम प्रदान करते हैं, वेक्टर घड़ियाँ सभी प्रक्रियाओं में लॉजिकल घड़ियों का एक वेक्टर बनाए रखती हैं। यदि कोई भी वेक्टर दूसरे पर हावी नहीं होता है, तो घटनाएं गणितीय रूप से समवर्ती होती हैं।',
    topic: 'Logical Clocks & Causality',
    topicHi: 'लॉजिकल घड़ियाँ और कार्य-कारण',
    source: 'Slide Deck: Distributed Snapshot & Clocks'
  }
];

/**
 * Generate audio briefs from the active subject's topics.
 * Each topic becomes a brief with a script derived from its description
 * and key concepts. Falls back to AUDIO_BRIEFS when no subject data.
 */
function buildBriefsFromSubject(subject) {
  const topics = subject?.topics || [];
  if (topics.length === 0) return AUDIO_BRIEFS;
  
  return topics.slice(0, 6).map((topic, i) => {
    const script = topic.description
      ? `${topic.title}. ${topic.description}`
      : `${topic.title}. This is a key concept in ${subject.title || 'the course material'}.`;
    
    return {
      id: `brief-${subject.id}-${i}`,
      title: topic.title,
      titleHi: topic.title,
      duration: '1m 30s',
      englishScript: script,
      hinglishScript: script,
      hindiScript: script,
      topic: topic.title,
      topicHi: topic.title,
      source: subject?.sourceName || subject?.title || 'Course material'
    };
  });
}

export default function AudioTutorPanel({ activeCourse, selectedSource, settings }) {
  const { t, language, isHindi } = useLanguage();
  const [activeBriefIndex, setActiveBriefIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechProgress, setSpeechProgress] = useState(0);

  const activeSubject = getActiveSubject(selectedSource, activeCourse);
  const briefs = buildBriefsFromSubject(activeSubject);
  const currentBrief = briefs[activeBriefIndex];
  const activeScript = isHindi 
    ? currentBrief.hindiScript 
    : language === 'hinglish' 
    ? currentBrief.hinglishScript 
    : currentBrief.englishScript;

  // Web Speech API Voice synthesis cleanup
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeScript);
      if (isHindi) utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      utterance.onboundary = (e) => {
        if (e.charIndex) {
          const pct = Math.min(100, Math.round((e.charIndex / activeScript.length) * 100));
          setSpeechProgress(pct);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setSpeechProgress(100);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setSpeechProgress(0);
    }
  };

  const handleSelectBrief = (idx) => {
    if (isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    setActiveBriefIndex(idx);
    setSpeechProgress(0);
  };

  // Reset to first brief when the active subject changes
  useEffect(() => {
    setActiveBriefIndex(0);
    setSpeechProgress(0);
    if (isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [selectedSource?.id, activeCourse?.id]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-950 to-slate-900 border border-purple-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5" />
              {t('audioRoomBadge')}
            </span>
            <span className="text-xs text-slate-400">{t('trackDEnhancement6')}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t('audioTitle')}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {t('audioDesc')}
          </p>
        </div>

        {/* Current Language Pill */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 p-2 rounded-xl shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-300 px-2 font-medium">
            <Languages className="w-4 h-4 text-purple-400" />
            <span>{isHindi ? 'हिन्दी ऑडियो मोड' : 'Active Language:'}</span>
          </div>
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white shadow-md">
            {isHindi ? 'हिन्दी' : language === 'hinglish' ? 'Hinglish' : 'English'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Audio Briefs Playlist */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            {t('availableAudioBriefs')}
          </div>

          <div className="space-y-2.5">
            {briefs.map((brief, idx) => {
              const isSelected = activeBriefIndex === idx;

              return (
                <div
                  key={brief.id}
                  onClick={() => handleSelectBrief(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-600/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                      {isHindi ? brief.topicHi : brief.topic}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{brief.duration}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100 line-clamp-1">
                    {isHindi ? brief.titleHi : brief.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{brief.source}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Audio Studio Player */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-2xl">
          
          {/* Top meta */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                {t('nowPlaying')} {isHindi ? currentBrief.topicHi : currentBrief.topic}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                {t('sourceVerifiedBrief')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {isHindi ? currentBrief.titleHi : currentBrief.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t('groundedIn')} {currentBrief.source}
            </p>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="h-28 rounded-xl bg-slate-950 border border-slate-800/80 p-4 flex items-center justify-center gap-1.5 overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent" />
            {[40, 65, 30, 85, 95, 45, 70, 35, 90, 60, 80, 50, 95, 75, 40, 65, 85, 30, 90, 55, 70, 45, 60, 80].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isPlaying 
                    ? 'bg-gradient-to-t from-indigo-500 to-purple-400 animate-pulse' 
                    : 'bg-slate-800'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * (0.4 + (i % 3) * 0.3)))}%` : '15%',
                  animationDelay: `${i * 60}ms`
                }}
              />
            ))}
          </div>

          {/* Live Script Ticker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>{t('liveTranscript')} ({isHindi ? 'हिन्दी' : language === 'hinglish' ? 'Hinglish' : 'English'}):</span>
              </span>
              <span className="text-[11px] font-mono text-purple-300">{speechProgress}% {t('spokenPct')}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans shadow-inner">
              "{activeScript}"
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              {t('voiceEngine')}
            </div>

            <button
              onClick={togglePlayAudio}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              <span>{isPlaying ? t('pauseAudioBrief') : t('playAudioBrief')}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
