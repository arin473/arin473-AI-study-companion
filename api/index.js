import app from '../server/index.js';

/**
 * Vercel Serverless Function entry point.
 * vercel.json rewrites /api/(.*) -> /api/index?originalPath=/api/$1 because
 * Vercel rewrites REPLACE the request URL: without the query param, Express
 * would see every request as "/api/index" and no /api/* route would match
 * (Express would return its default HTML 404 page -> frontend "<!DOCTYPE"
 * JSON-parse failure).
 *
 * This wrapper restores req.url from ?originalPath= before Express handles
 * the request, logs the mapping for Function Logs diagnostics, and guarantees
 * a JSON response even if the Express app itself throws during dispatch.
 */
export default function handler(req, res) {
  try {
    const originalPath = req.query?.originalPath;
    if (typeof originalPath === 'string' && originalPath.startsWith('/api/')) {
      // Restore the pre-rewrite path, dropping the helper query param so
      // downstream handlers see a clean URL (Express ignores unknown query
      // params for routing, but clean URLs keep logs and body parsing exact).
      const qsIndex = (req.url || '').indexOf('?');
      let restQuery = '';
      if (qsIndex >= 0) {
        const params = new URLSearchParams((req.url || '').slice(qsIndex + 1));
        params.delete('originalPath');
        const rest = params.toString();
        if (rest) restQuery = `?${rest}`;
      }
      console.log(`[api/index] rewrite restore: ${req.url} -> ${originalPath}${restQuery}`);
      req.url = `${originalPath}${restQuery}`;
    } else {
      console.log(`[api/index] direct: ${req.method} ${req.url}`);
    }
  } catch (restoreErr) {
    console.error('[api/index] path-restore warning:', restoreErr.message);
  }

  try {
    return app(req, res);
  } catch (dispatchErr) {
    console.error('[api/index] Express dispatch crashed:', dispatchErr);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: `API dispatch failed: ${dispatchErr.message || 'Unknown error'}` }));
      return;
    }
    throw dispatchErr;
  }
}
