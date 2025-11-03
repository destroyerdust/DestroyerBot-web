// CORS configuration for Vercel serverless functions
const ALLOWED_ORIGINS = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:4173'  // Vite preview server
];

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
