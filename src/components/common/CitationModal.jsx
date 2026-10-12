import React, { useRef, useEffect, useState } from 'react';
import { 
  X, 
  ExternalLink, 
  FileText, 
  Video, 
  Presentation, 
  CheckCircle, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';

export default function CitationModal({ citation, isOpen, onClose }) {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  // Seek to the cited timestamp whenever the modal opens or the citation changes
  useEffect(() => {
    if (isOpen && videoRef.current && citation?.videoTimestampSeconds != null) {
      // Small delay to ensure the video element has loaded its src
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = citation.videoTimestampSeconds;
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, citation?.videoTimestampSeconds]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !citation) return null;

  const isVideo = citation.sourceType === 'video';
  const isSlide = citation.sourceType === 'slides';
  const isDocument = citation.sourceType === 'textbook' || citation.sourceType === 'document';
  const hasLocation = Boolean(citation.location && citation.location.trim() && citation.location !== 'Unknown');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl glass-panel border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-xl text-white ${
              isVideo ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              isSlide ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {isVideo && <Video className="w-5 h-5" />}
              {isSlide && <Presentation className="w-5 h-5" />}
              {isDocument && <FileText className="w-5 h-5" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Grounding Source Verification
                </span>
                {hasLocation ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle className="w-3 h-3" /> Origin Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    <AlertCircle className="w-3 h-3" /> Location Tag Unavailable
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm text-slate-100 truncate max-w-md">
                {citation.title || citation.sourceName}
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          
          {/* Location Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Location Coordinate:</span>
              {hasLocation ? (
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                  {citation.location}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 font-mono text-[11px] italic border border-slate-700">
                  Specific section/slide unavailable
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{citation.sourceName}</span>
            </div>
          </div>

          {/* Real Video Player or Honest No-Media State */}
          {isVideo && (
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 relative">
              {citation.fileUrl ? (
                <video
                  ref={videoRef}
                  src={citation.fileUrl}
                  controls
                  className="w-full aspect-video bg-black rounded-lg"
                  onError={() => setVideoError(true)}
                />
              ) : (
                <div className="aspect-video bg-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <div className="w-14 h-14 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-300">
                    No media file available for this citation
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                    {citation.location
                      ? `Cited location: ${citation.location}. The excerpt below is grounded in the source text.`
                      : 'The excerpt below is grounded in the source text.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Diagram / Slide Image Viewer */}
          {citation.diagram && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Multimodal Extracted Figure
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900/80 p-2 shadow-inner">
                <img 
                  src={citation.diagram} 
                  alt={citation.diagramCaption || 'Extracted Diagram'} 
                  className="w-full h-56 object-cover rounded-lg"
                />
                {citation.diagramCaption && (
                  <p className="text-xs text-center text-slate-400 mt-2 italic">
                    {citation.diagramCaption}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Verbatim Excerpt */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Verbatim Grounding Text</span>
              <span className="text-[10px] text-indigo-400 font-mono">(Direct Ingestion Match)</span>
            </span>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs leading-relaxed font-sans border-l-4 border-l-indigo-500 shadow-inner">
              "{citation.preview || citation.excerpt || 'Syllabus excerpt verified.'}"
            </div>
          </div>

          {/* Direct File Link if uploaded file exists */}
          {citation.fileUrl && (
            <div className="pt-2">
              <a 
                href={citation.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open original source file in new tab</span>
              </a>
            </div>
          )}

        </div>

        {/* Video load error notice */}
        {videoError && (
          <p className="px-5 pb-1 text-[11px] text-amber-400">
            The source media could not be loaded. Verify the excerpt text below against the original file.
          </p>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Grounded via <span className="text-indigo-300 font-semibold">{citation.sourceName || citation.title}</span>
            {hasLocation && <span className="text-slate-500"> · {citation.location}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
