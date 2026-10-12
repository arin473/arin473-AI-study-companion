import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Video, 
  FileText, 
  Presentation, 
  CheckCircle, 
  AlertCircle,
  Clock, 
  Tag, 
  Sparkles, 
  Search, 
  ExternalLink,
  Layers,
  FileCode,
  Image as ImageIcon,
  FolderUp
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { GeminiService } from '../../services/geminiService';

export default function MultimodalUpload({ 
  activeCourse, 
  selectedSource, 
  onSelectSource, 
  onOpenCitation, 
  onAddSource 
}) {
  const { t, isHindi } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [targetFileType, setTargetFileType] = useState('textbook');

  const fileInputRef = useRef(null);

  // Trigger file picker for specific media type
  const triggerPicker = (type) => {
    setTargetFileType(type);
    setUploadError(null);
    setUploadSuccess(null);
    if (fileInputRef.current) {
      if (type === 'video') {
        fileInputRef.current.accept = '.mp4,.webm,.mov,.mkv';
      } else if (type === 'slides') {
        fileInputRef.current.accept = '.pptx,.ppt,.pdf';
      } else {
        fileInputRef.current.accept = '.pdf';
      }
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle real file ingestion
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (100MB limit for hackathon prototype)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(isHindi 
        ? 'फ़ाइल का आकार 100MB से अधिक है। कृपया छोटी फ़ाइल चुनें।' 
        : 'File size exceeds 100MB limit. Please select a smaller file.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadProgress(15);
    setUploadStage(isHindi 
      ? `"${file.name}" अपलोड किया जा रहा है...` 
      : `Uploading "${file.name}" to multimodal ingestion pipeline...`);

    try {
      const progressTimer1 = setTimeout(() => {
        setUploadProgress(45);
        setUploadStage(targetFileType === 'video'
          ? (isHindi ? 'जेमिनी वीडियो फ्रेम और टाइमस्टैम्प संसाधित किए जा रहे हैं...' : 'Processing Gemini multimodal video frames & speech timestamps...')
          : (isHindi ? 'जेमिनी विज़न और दस्तावेज़ लेआउट का विश्लेषण किया जा रहा है...' : 'Extracting document layout, formulas & visual coordinates via Gemini...'));
      }, 600);

      const progressTimer2 = setTimeout(() => {
        setUploadProgress(80);
        setUploadStage(isHindi 
          ? 'पाठ्यक्रम ज्ञान ग्राफ में उद्धरण और सूत्र इंडेक्स किए जा रहे हैं...' 
          : 'Indexing syllabus topics & exact page/slide citations into knowledge graph...');
      }, 1500);

      const response = await GeminiService.uploadSourceFile({
        file,
        courseId: activeCourse?.id,
        fileType: targetFileType
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);

      setUploadProgress(100);
      setUploadStage(isHindi ? 'सफल! स्रोत ज्ञानकोश में शामिल किया गया।' : 'Completed! Source indexed.');

      if (response?.source) {
        if (onAddSource) {
          onAddSource(response.source);
        }
        if (onSelectSource) {
          onSelectSource(response.source);
        }
        setUploadSuccess(isHindi 
          ? `सफलतापूर्वक शामिल किया गया: ${response.source.title}` 
          : `Successfully indexed: ${response.source.title} (${response.source.pages ? `${response.source.pages} Pages` : response.source.slides ? `${response.source.slides} Slides` : response.source.duration || 'Media'})`);
      }

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStage('');
      }, 1200);

    } catch (err) {
      console.error('File ingestion error:', err);
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage('');
      setUploadSuccess(null);
      setUploadError(err.message || 'File ingestion failed. Please check server connection.');
    }
  };

  const sources = activeCourse?.sources || [];
  const filteredSources = sources.filter(s => {
    const matchesFilter = activeFilter === 'all' || s.type === activeFilter;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.origin || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Hidden Real File Input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Banner / Ingestion Intro */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t('ingestionBadge')}
            </span>
            <span className="text-xs text-slate-400">{t('trackDReq1')}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t('ingestionTitle')}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {t('ingestionDesc')}
          </p>
        </div>

        {/* Upload Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button 
            disabled={isUploading}
            onClick={() => triggerPicker('video')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-all disabled:opacity-50 hover:scale-105"
            title="Upload MP4, WebM, or MOV video lecture"
          >
            <Video className="w-4 h-4 text-red-400" />
            <span>{t('btnIngestVideo')}</span>
          </button>

          <button 
            disabled={isUploading}
            onClick={() => triggerPicker('textbook')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-all disabled:opacity-50 hover:scale-105"
            title="Upload PDF document or paper"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>{t('btnIngestPdf')}</span>
          </button>

          <button 
            disabled={isUploading}
            onClick={() => triggerPicker('slides')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all disabled:opacity-50 hover:scale-105"
            title="Upload PPT, PPTX, or PDF presentation slides"
          >
            <Presentation className="w-4 h-4 text-amber-400" />
            <span>{t('btnIngestSlides')}</span>
          </button>
        </div>
      </div>

      {/* Upload Progress Banner */}
      {isUploading && (
        <div className="p-4 rounded-xl glass-panel border border-indigo-500/40 bg-indigo-950/40 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-300 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 animate-bounce text-indigo-400" />
              {uploadStage}
            </span>
            <span className="font-mono text-indigo-300 font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Upload Failed:</span> {uploadError}
            </div>
          </div>
          <button 
            onClick={() => setUploadError(null)}
            className="text-xs text-red-400 hover:text-white underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Success Banner */}
      {uploadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
          <button 
            onClick={() => setUploadSuccess(null)}
            className="text-xs text-emerald-400 hover:text-white underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Controls: Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('filterAll')} ({sources.length})
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'video'
                ? 'bg-indigo-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-red-400" />
            <span>{t('filterVideos')}</span>
          </button>
          <button
            onClick={() => setActiveFilter('textbook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'textbook'
                ? 'bg-indigo-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('filterTextbooks')}</span>
          </button>
          <button
            onClick={() => setActiveFilter('slides')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'slides'
                ? 'bg-indigo-600 text-white font-medium shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('filterSlides')}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Ingested Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => {
          const isVid = source.type === 'video';
          const isSlide = source.type === 'slides';
          const isSelected = selectedSource?.id === source.id;

          return (
            <div 
              key={source.id}
              onClick={() => onSelectSource && onSelectSource(source)}
              className={`glass-card glass-card-hover p-4 rounded-2xl flex flex-col justify-between space-y-3 cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-indigo-500 border-indigo-500/80 bg-indigo-950/20 shadow-lg shadow-indigo-500/10' 
                  : 'hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`p-2 rounded-xl ${
                    isVid ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    isSlide ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {isVid && <Video className="w-4 h-4" />}
                    {isSlide && <Presentation className="w-4 h-4" />}
                    {!isVid && !isSlide && <FileText className="w-4 h-4" />}
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-indigo-400" />
                        {t('activeSubject') || 'Active Subject'}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {source.status?.includes('Gemini') ? 'Gemini Indexed' : t('statusIndexed')}
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold text-sm text-slate-100 line-clamp-2 leading-snug">
                  {source.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {source.origin}
                </p>
              </div>

              {/* Metadata tags */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {source.pages ? `${source.pages} Pages` :
                     source.slides ? `${source.slides} Slides` :
                     source.duration ? `Duration: ${source.duration}` : 'Full Syllabus'}
                  </span>
                  <span className="font-mono text-indigo-400">
                    {source.extractedTokens ? `${(source.extractedTokens / 1000).toFixed(1)}k tokens` : ''}
                  </span>
                </div>

                {/* Actions row: Select Button + Open Citation */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSource && onSelectSource(source);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800/80 hover:bg-indigo-600/30 hover:text-white text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span>{isSelected ? (t('activeSubject') || 'Active Subject') : 'Set Active'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Citations live at course level (and on uploaded sources) —
                      // look there first, then fall back to course-level matches.
                      const firstCite = source.sampleCitations?.[0]
                        || activeCourse?.sampleCitations?.find(c =>
                            c.sourceName === source.title || c.title === source.title)
                        || activeCourse?.sampleCitations?.[0];
                      onOpenCitation({
                        sourceType: source.type,
                        sourceName: source.title,
                        location: firstCite?.location || (source.timestamp ? `Timestamp ${source.timestamp}` : source.pages ? 'Page 1' : 'Slide 1'),
                        preview: firstCite?.preview || (isHindi
                          ? 'मल्टीमॉडल स्रोत इकाई पूर्ण पाठ्यक्रम निर्देशांकों और आरेख निष्कर्षण के साथ अनुक्रमित।'
                          : 'Multimodal source unit indexed with syllabus coordinates and visual extraction.'),
                        diagram: isSlide ? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80' : undefined,
                        fileUrl: source.fileUrl,
                        videoTimestampSeconds: firstCite?.videoTimestampSeconds || 0
                      });
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700/60"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t('inspectOriginLink')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extracted Multimodal Diagrams Showcase */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-sm text-slate-200">
              {t('extractedFiguresTitle')}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">{t('extractedFiguresSubtitle')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCourse?.sampleCitations?.map((cite) => (
            <div 
              key={cite.id}
              onClick={() => onOpenCitation(cite)}
              className="glass-card glass-card-hover rounded-xl p-3 cursor-pointer group space-y-2 border border-slate-800"
            >
              {cite.diagram ? (
                <div className="rounded-lg overflow-hidden h-36 bg-slate-900 relative">
                  <img 
                    src={cite.diagram} 
                    alt={cite.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-indigo-300 border border-slate-700">
                    {cite.location}
                  </div>
                </div>
              ) : (
                <div className="h-36 rounded-lg bg-slate-900 flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                  <Video className="w-8 h-8 text-red-400 mb-1" />
                  <span className="text-xs text-slate-300 font-semibold">{cite.title}</span>
                  <span className="text-[10px] text-indigo-400 font-mono mt-1">{cite.location}</span>
                </div>
              )}
              <div className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                {cite.title}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 italic">
                "{cite.preview}"
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
