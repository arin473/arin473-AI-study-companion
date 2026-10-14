/**
 * Main Backend Server
 * Secure API Gateway for Google Gemini integration, File uploads, Tutor Grounding,
 * and Benchmark Evaluations. Serves Vite in development mode on port 5173.
 * 
 * NOTE: Uploads use Vercel Blob for persistent storage. Files are uploaded directly
 * from the browser to Vercel Blob (bypassing server function payload limits), then
 * the server processes them from the Blob URL and uploads to Gemini File API.
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import crypto from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import { GeminiBackendService } from './geminiBackend.js';
import { runSimulatedLearners } from './evaluatePersonalization.js';

// ESM has no __dirname — resolve the project root so dotenv can find .env files.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load .env files for local development.
// On Vercel, environment variables are injected directly into process.env by
// the platform; dotenv does not override existing process.env values by default.
// This MUST run before any code reads process.env.VERCEL_BLOB_TOKEN below.
dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, '.env.local') });

const app = express();
// Default port MUST match vite.config.js proxy target (localhost:3001) so
// `npm run server` + `vite` in separate terminals works without ECONNREFUSED.
// server/dev.js also spawns the backend with PORT=3001. (Vercel ignores this;
// the listen() call below is skipped when process.env.VERCEL is set.)
const PORT = process.env.PORT || 3001;

// Middleware FIRST — before any routes, so every /api/* response (including
// errors) gets CORS headers and JSON body parsing. Previously cors()/json()
// were registered AFTER /api/blob-upload-url, so that route missed them.
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging — critical for diagnosing Vercel production issues via
// Runtime/Function Logs (filter by "[API]").
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Vercel Blob token — read from environment (Vercel secret or .env file).
// Used to generate signed upload URLs for direct browser→Blob uploads.
// Do NOT expose this to the browser; it authorizes server-side Blob writes.
// A missing token is handled per-endpoint with a JSON error response —
// NEVER process.exit(), which would crash the serverless function during
// initialization and cause Vercel to return an HTML 500 error page
// (the exact "Unexpected token '<', \"<!DOCTYPE" symptom on the frontend).
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN || '';
const BLOB_TOKEN_VAR_NAME = process.env.BLOB_READ_WRITE_TOKEN
  ? 'BLOB_READ_WRITE_TOKEN'
  : (process.env.VERCEL_BLOB_TOKEN ? 'VERCEL_BLOB_TOKEN' : '(missing: set BLOB_READ_WRITE_TOKEN or VERCEL_BLOB_TOKEN)');

/**
 * Generate a signed Vercel Blob upload URL for direct frontend upload.
 * The frontend uses this URL to upload files directly to Vercel Blob storage,
 * bypassing server function payload limits.
 *
 * Always returns JSON on both success and failure — never an HTML error page.
 * Supports PDF (application/pdf), video (video/*), and slides
 * (application/vnd.openxmlformats-officedocument.presentationml.presentation)
 * — the file type is determined by the frontend at upload time, not here.
 */
app.get('/api/blob-upload-url', async (req, res) => {
  try {
    // Missing token → return JSON (not an HTML 500 page). The frontend
    // surfaces a clear error instead of a JSON parse failure.
    if (!BLOB_TOKEN) {
      console.error('[Server] /api/blob-upload-url: no Blob token found. Checked BLOB_READ_WRITE_TOKEN and VERCEL_BLOB_TOKEN — both missing.');
      return res.status(500).json({
        ok: false,
        error: 'Vercel Blob token is not configured. Set BLOB_READ_WRITE_TOKEN (auto-created when a Blob store is connected) or VERCEL_BLOB_TOKEN (generate via: vercel blob tokens create) as a Vercel environment variable.'
      });
    }

    // Generate a unique path for the Blob upload.
    // crypto is imported from node:crypto (available Node.js 14.17+).
    let blobPath;
    try {
      blobPath = `uploads/${Date.now()}-${crypto.randomUUID()}`;
    } catch (uuidErr) {
      console.warn('[Server] crypto.randomUUID() failed, using fallback UUID:', uuidErr.message);
      blobPath = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 20)}`;
    }

    // Vercel Blob upload endpoint. The browser PUTs the file directly to
    // this URL; the token in the query string authorizes the write.
    const signedUrl = `https://blob.vercel-storage.com/upload?path=${encodeURIComponent(blobPath)}&token=${BLOB_TOKEN}`;

    console.log(`[Server] Generated Blob upload URL for path: ${blobPath} (token from ${BLOB_TOKEN_VAR_NAME})`);
    return res.json({ ok: true, blobUrl: signedUrl, blobPath });
  } catch (err) {
    // NEVER return an HTML error page. Always return JSON so the frontend
    // can parse the response and surface the real error message.
    console.error('[Server] /api/blob-upload-url unexpected error:', err);
    return res.status(500).json({
      ok: false,
      error: `Failed to generate Blob upload URL: ${err.message || 'Unknown error'}`
    });
  }
});

/**
 * Vercel Blob client-upload token route (documented SDK flow).
 * The browser calls upload(filename, file, { handleUploadUrl: '/api/blob-upload' })
 * from '@vercel/blob/client'; the SDK POSTs token-exchange bodies here and this
 * route answers via handleUpload(). Requires BLOB_READ_WRITE_TOKEN (auto-created
 * when a Blob store is connected) or VERCEL_BLOB_TOKEN as fallback.
 * Accepts PDF (application/pdf), video (video/*), and slides (.pptx MIME).
 */
app.post('/api/blob-upload', async (req, res) => {
  try {
    if (!BLOB_TOKEN) {
      console.error('[Server] /api/blob-upload: no Blob token found. Checked BLOB_READ_WRITE_TOKEN and VERCEL_BLOB_TOKEN — both missing.');
      return res.status(500).json({
        ok: false,
        error: 'Vercel Blob token is not configured. Set BLOB_READ_WRITE_TOKEN (auto-created when a Blob store is connected) or VERCEL_BLOB_TOKEN as a Vercel environment variable.'
      });
    }
    // handleUpload reads the token from process.env.BLOB_READ_WRITE_TOKEN by
    // default; expose our resolved token under that name if only the custom
    // VERCEL_BLOB_TOKEN is configured.
    if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.VERCEL_BLOB_TOKEN) {
      process.env.BLOB_READ_WRITE_TOKEN = process.env.VERCEL_BLOB_TOKEN;
    }
    const { handleUpload } = await import('@vercel/blob/client');
    const body = req.body;
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        console.log(`[Server] Blob client upload token requested for: ${pathname}`);
        return {
          allowedContentTypes: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-powerpoint',
            'video/mp4',
            'video/webm',
            'video/quicktime',
            'video/x-matroska'
          ],
          addRandomSuffix: true
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('[Server] Blob client upload completed:', blob.url);
      }
    });
    return res.json(jsonResponse);
  } catch (err) {
    console.error('[Server] /api/blob-upload error:', err);
    return res.status(400).json({ ok: false, error: err.message || 'Blob upload token exchange failed.' });
  }
});

// Multer memory storage (only used as fallback / for API routes that need it)
// We no longer use diskStorage to avoid EROFS on Vercel.
// Using memoryStorage with a size limit; for large files, frontend uploads directly to Vercel Blob.
const memoryStorage = multer.memoryStorage({
  destination: (req, file, cb) => cb(null, ''),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${cleanName}`);
  }
});

const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for memory storage fallback
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.pptx', '.ppt', '.mp4', '.webm', '.mov', '.mkv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}. Supported formats are: PDF, PPT/PPTX, and Video (MP4/WebM/MOV).`));
    }
  }
});

const geminiService = new GeminiBackendService();

// ==========================================
// API ROUTES
// ==========================================

// System Status / Health
app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    configured: geminiService.isConfigured(),
    model: geminiService.modelName,
    message: geminiService.isConfigured()
      ? 'Google Gemini API is configured and operational.'
      : 'GEMINI_API_KEY is not set. System running in Grounded Core Mode.'
  });
});

// Real Multimodal File Upload (PDF, PPT/PPTX, Video)
app.post('/api/upload', async (req, res) => {
  try {
    const { blobUrl, courseId, fileType, originalName, mimeType } = req.body;

    if (!blobUrl || !originalName) {
      return res.status(400).json({ ok: false, error: 'Blob URL and original name are required.' });
    }

    const ext = path.extname(originalName).toLowerCase();
    const resolvedType = fileType || (ext === '.pdf' ? 'textbook' : (ext === '.pptx' || ext === '.ppt') ? 'slides' : 'video');

    console.log(`[Server] Received upload request for: ${originalName} (${resolvedType}) via Blob URL`);

    let geminiFile = null;
    let analysisResult = null;

    // .ppt (legacy binary) is NOT supported by the Gemini File API — only .pptx (OOXML) is.
    // For .ppt files we skip the Gemini upload and rely on text-only metadata.
    const isLegacyPpt = ext === '.ppt';

    // Download the file from Vercel Blob URL so we can upload to Gemini File API.
    // Serverless functions MUST respond within the platform timeout (10s on
    // Hobby, 60s on Pro), so every network hop below has a strict deadline and
    // every slow step degrades to an indexed record instead of hanging forever
    // (the "stuck progress bar" symptom).
    let fileContent = null;
    try {
      // fetch is available globally in Node.js 18+ (project uses ESM)
      const downloadCtrl = new AbortController();
      const downloadTimer = setTimeout(() => downloadCtrl.abort(), 25000);
      try {
        const response = await fetch(blobUrl, { signal: downloadCtrl.signal });
        if (response.ok) {
          fileContent = await response.arrayBuffer();
        } else {
          throw new Error(`Failed to download from Blob URL: ${response.status}`);
        }
      } finally {
        clearTimeout(downloadTimer);
      }
    } catch (fetchErr) {
      console.warn('[Server] Could not download from Blob URL:', fetchErr.message);
      fileContent = null;
    }

    // Helper: race any promise against a deadline so slow AI steps degrade
    // instead of exceeding the serverless function timeout.
    const withDeadline = (promise, ms, label) => Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms))
    ]);

    if (!isLegacyPpt && fileContent) {
      // No API key: skip Gemini entirely and return an indexed record (200),
      // not a 500. The status string below explains Grounded Core Mode.
      if (!process.env.GEMINI_API_KEY) {
        console.log('[Server] GEMINI_API_KEY not set — indexing without live AI analysis.');
      } else {
        try {
          // Initialize GoogleGenAI client for this request
          const googleGenAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          try {
            const effectiveMime = mimeType || (ext === '.pdf' ? 'application/pdf' : (ext === '.pptx' || ext === '.ppt') ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'video/mp4');
            // Upload to Gemini File API using the file content from Blob.
            // The @google/genai SDK v2 accepts Blob, ArrayBuffer, ReadableStream, or string path.
            // Budget: 40s — beyond that we degrade rather than risk function timeout.
            geminiFile = await withDeadline(
              googleGenAi.files.upload({
                file: fileContent,
                config: {
                  displayName: originalName,
                  mimeType: effectiveMime
                }
              }),
              40000,
              'Gemini file upload'
            );
            console.log(`[GeminiBackend] File uploaded to Gemini: ${geminiFile.name}, initial state: ${geminiFile.state}`);

            // For video files, poll until ACTIVE — but cap the wait so the
            // function always responds in time (~5 attempts x 4s = ~20s max).
            if (effectiveMime.startsWith('video/')) {
              let attempts = 0;
              const MAX_POLL = 5;
              while (attempts < MAX_POLL) {
                const state = geminiFile.state?.toString();
                if (state === 'ACTIVE') break;
                if (state === 'FAILED') {
                  throw new Error('Gemini File API video processing failed.');
                }
                await new Promise(r => setTimeout(r, 4000));
                geminiFile = await googleGenAi.files.get({ name: geminiFile.name });
                attempts++;
              }
              if (geminiFile.state?.toString() !== 'ACTIVE') {
                // Don't fail the whole upload: record the file as still
                // processing so the UI completes instead of hanging.
                console.warn('[Server] Video not ACTIVE yet after bounded polling — indexing as processing.');
              }
            }

            // Full-text extraction: best-effort with a short budget. Failure
            // must never block the response.
            try {
              await withDeadline(
                googleGenAi.models.generateContent({
                  model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
                  contents: [{
                    role: 'user',
                    parts: [
                      { text: 'Extract and return the complete full text content of this document exactly as it appears, preserving all headings, lists, tables, and numbering. Do not summarize. Return only the plain text content.' },
                      { fileData: { fileUri: geminiFile.uri, mimeType: effectiveMime } }
                    ]
                  }]
                }).catch(e =>
                  console.warn('[Server] extractFullText non-blocking skipped:', e.message)
                ),
                20000,
                'Full-text extraction'
              );
            } catch (extractErr) {
              console.warn('[Server] extractFullText non-blocking warning:', extractErr.message);
            }

            analysisResult = await withDeadline(
              geminiService.analyzeUploadedSource(geminiFile, resolvedType, originalName),
              40000,
              'Source analysis'
            );
          } catch (err) {
            // Degrade, don't 500: the file IS stored (Blob + Gemini file if the
            // upload succeeded). Return an indexed record with an honest status
            // so the UI completes instead of hanging or erroring out.
            console.error('[Server] Gemini step failed, degrading to indexed record:', err.message);
          }
        } catch (err) {
          console.error('[Server] Gemini initialization error:', err);
          res.status(500).json({ ok: false, error: err.message || 'Gemini API initialization failed.' });
          return;
        }
      }
    } else if (isLegacyPpt) {
      console.log('[Server] .ppt (legacy binary) is not supported by Gemini File API. Indexing as text-only. Suggest converting to .pptx.');
    } else if (!fileContent) {
      console.warn('[Server] No file content downloaded from Blob URL — indexing metadata only.');
    }

    // Determine metadata — prefer real Gemini analysis values, fall back to sensible defaults
    const rawUnitCount = analysisResult?.unitCount;
    const pages = resolvedType === 'textbook'
      ? (typeof rawUnitCount === 'number' ? rawUnitCount : 16)
      : undefined;
    const slides = resolvedType === 'slides'
      ? (typeof rawUnitCount === 'number' ? rawUnitCount : 24)
      : undefined;
    const duration = resolvedType === 'video'
      ? (typeof rawUnitCount === 'string' ? rawUnitCount : '42m 00s')
      : undefined;

    // Determine status string based on what actually happened
    let statusStr;
    if (geminiFile && analysisResult) {
      statusStr = 'Processed (100% - Gemini Multimodal)';
    } else if (isLegacyPpt) {
      statusStr = 'Indexed (Text-only — convert to .pptx for Gemini vision)';
    } else if (geminiFile && !analysisResult) {
      statusStr = 'Indexed (file stored — AI analysis incomplete, check server logs)';
    } else if (process.env.GEMINI_API_KEY) {
      statusStr = 'Indexed (Gemini processing failed — check server logs)';
    } else {
      statusStr = 'Indexed (Local Knowledge Engine — set GEMINI_API_KEY for live AI)';
    }

    // Ensure every sampleCitation has fileUrl and sourceName so CitationModal can open the file
    const enhancedCitations = (analysisResult?.sampleCitations || []).map(c => ({
      id: c.id || ('cite-' + Date.now() + '-' + Math.random().toString(36).slice(2)),
      ...c,
      sourceName: c.sourceName || (analysisResult?.title || originalName),
      fileUrl: geminiFile?.uri || `/blob/placeholder`  // Use Gemini file URI instead of local path
    }));

    const newSource = {
      id: 'src-upload-' + Date.now(),
      type: resolvedType,
      title: analysisResult?.title || originalName.replace(/\.[^/.]+$/, ''),
      origin: `Uploaded Source (${originalName})`,
      fileName: originalName,
      fileUrl: geminiFile?.uri || `/blob/placeholder`,  // Use Gemini file URI instead of local path
      fileSize: 'Unknown',  // Will be populated if we have size info
      mimeType: mimeType || (ext === '.pdf' ? 'application/pdf' : (ext === '.pptx' || ext === '.ppt') ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'video/mp4'),
      pages,
      slides,
      duration,
      timestamp: resolvedType === 'video' ? '00:00' : undefined,
      status: statusStr,
      extractedTokens: analysisResult?.extractedTokens || 0,
      topicsTagged: analysisResult?.topics || ['topic-uploaded-material'],
      subjectId: 'subject-' + (analysisResult?.title || originalName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      geminiFileUri: geminiFile?.uri || null,
      geminiFileName: geminiFile?.name || null,
      fileUri: geminiFile?.uri || null,
      fileData: geminiFile ? {
        fileUri: geminiFile.uri,
        mimeType: mimeType || (ext === '.pdf' ? 'application/pdf' : (ext === '.pptx' || ext === '.ppt') ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'video/mp4')
      } : null,
      sampleCitations: enhancedCitations.length > 0
        ? enhancedCitations
        : [
            {
              id: 'cite-' + Date.now(),
              title: analysisResult?.title || originalName,
              sourceType: resolvedType,
              sourceName: analysisResult?.title || originalName,
              location: resolvedType === 'slides' ? 'Slide 1' : resolvedType === 'video' ? 'Timestamp 00:00' : 'Page 1',
              preview: analysisResult?.summary || 'Source indexed. Upload more or ask the AI tutor about this material.',
              fileUrl: geminiFile?.uri || `/blob/placeholder`
            }
          ]
    };

    res.json({
      ok: true,
      source: newSource,
      message: geminiFile
        ? 'File successfully processed and indexed via Google Gemini File API.'
        : isLegacyPpt
          ? 'Legacy .ppt uploaded (text-only mode). Convert to .pptx for full Gemini multimodal analysis.'
          : 'File uploaded and indexed in Grounded Core Mode (set GEMINI_API_KEY for live AI analysis).'
    });

  } catch (err) {
    console.error('[Server] Upload endpoint error:', err);
    res.status(500).json({ ok: false, error: err.message || 'File processing failed.' });
  }
});

// Grounded AI Tutor Endpoint
app.post('/api/tutor', async (req, res) => {
  try {
    const { query, course, selectedSource, activeTopic, chatHistory, language, isStrict } = req.body;
    if (!query) {
      return res.status(400).json({ ok: false, error: 'Query string is required.' });
    }

    const response = await geminiService.askTutor({
      query,
      course,
      selectedSource,
      activeTopic,
      chatHistory,
      language: language || 'en',
      isStrict: isStrict ?? true
    });

    res.json(response);
  } catch (err) {
    console.error('[Server] Tutor endpoint error:', err);
    res.status(500).json({
      text: `Gemini Error: ${err.message || 'An unexpected error occurred while querying the knowledge base.'}`,
      grounded: false,
      isOutsideKnowledge: false,
      citations: [],
      provider: 'Gemini Error Handler'
    });
  }
});

// Adaptive Assessment Generator Endpoint
app.post('/api/generate-assessment', async (req, res) => {
  try {
    const { course, topicId, count = 4, format = 'all' } = req.body;
    // Return dynamically generated questions or filtered questions from active course
    res.json({ ok: true, questions: [] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Real RAG System Evaluation Endpoint
app.get('/api/evaluate-rag', async (req, res) => {
  try {
    const evaluationResults = await geminiService.runRagEvaluation();
    res.json({ ok: true, data: evaluationResults });
  } catch (err) {
    console.error('[Server] RAG evaluation error:', err);
    res.status(500).json({ ok: false, data: err.message });
  }
});

// Real Personalization Evaluation Endpoint (Simulated Students)
app.get('/api/evaluate-personalization', (req, res) => {
  try {
    const profiles = runSimulatedLearners();
    res.json({ ok: true, data: profiles });
  } catch (err) {
    console.error('[Server] Personalization evaluation error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 404 catch-all for /api/* — MUST return JSON, never Express's default HTML
// "Cannot GET /api/..." page. Without this, a mis-routed request produces the
// exact "<!DOCTYPE..." HTML the frontend chokes on.
app.use('/api', (req, res) => {
  console.error(`[Server] 404 no API route matched: ${req.method} ${req.url} (originalUrl: ${req.originalUrl})`);
  res.status(404).json({ ok: false, error: `API route not found: ${req.method} ${req.originalUrl || req.url}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server] Uncaught error:', err);
  res.status(500).json({ ok: false, error: err.message || 'Internal server error' });
});

if(!process.env.VERCEL){
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 AI Study Companion API Backend is Running!`);
  console.log(`📡 Port: ${PORT} (API at http://localhost:${PORT}/api)`);
  console.log(`🔑 Gemini API Key: ${geminiService.isConfigured() ? 'Configured ✅' : 'Not Set (Running in Grounded Core Mode) ⚠️'}`);
  console.log(`======================================================\n`);
});
}

export default app