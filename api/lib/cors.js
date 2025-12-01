/**
 * CORS (Cross-Origin Resource Sharing) utilities for Vercel serverless functions.
 * Handles CORS headers and preflight requests for cross-origin API access.
 * @module api/lib/cors
 */

/**
 * List of allowed origins for CORS requests.
 * Includes local development servers (Vite dev and preview).
 * @type {string[]}
 */
const ALLOWED_ORIGINS = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:4173'  // Vite preview server
];

/**
 * Sets CORS headers on the response object and handles preflight OPTIONS requests.
 * Allows credentials and common HTTP methods (GET, POST, PUT, DELETE, OPTIONS).
 *
 * In production environments, this currently allows all origins for flexibility.
 * Consider restricting this to specific production domains for enhanced security.
 *
 * @param {Object} req - The HTTP request object
 * @param {Object} req.headers - Request headers
 * @param {string} [req.headers.origin] - Origin header from the request
 * @param {string} req.method - HTTP method (GET, POST, etc.)
 * @param {Object} res - The HTTP response object
 * @returns {boolean} True if the request was a preflight OPTIONS request (indicating it was handled), false otherwise
 *
 * @example
 * // In a serverless function handler
 * if (handleCors(req, res)) {
 *   return; // Preflight request was handled
 * }
 * // Continue with regular request handling
 */
export function handleCors(req, res) {
  const origin = req.headers.origin;

  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // In production, you might want to restrict this further
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Indicate that the request was handled
  }

  return false; // Indicate that the request should continue processing
}

/**
 * Middleware wrapper that applies CORS handling to a serverless function handler.
 * Automatically handles CORS preflight requests and sets appropriate headers.
 *
 * @param {Function} handler - The serverless function handler to wrap
 * @returns {Function} A wrapped handler function with CORS support
 *
 * @example
 * // In a serverless function file (e.g., api/guilds/index.js)
 * async function handler(req, res) {
 *   // Your handler logic
 *   return res.status(200).json({ data: 'example' });
 * }
 *
 * export default corsMiddleware(handler);
 */
export function corsMiddleware(handler) {
  return async (req, res) => {
    // Handle CORS
    if (handleCors(req, res)) {
      return; // CORS preflight handled
    }

    // Continue with the actual handler
    return handler(req, res);
  };
}
