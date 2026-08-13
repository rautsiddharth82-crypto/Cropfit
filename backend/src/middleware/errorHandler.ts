/**
 * Global Error Handler Middleware
 */
import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(`[ErrorHandler] ${req.method} ${req.path}:`, err.message);

  // Don't expose internal errors in production
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(500).json({
    error: 'Internal Server Error',
    message: isDev ? err.message : 'An unexpected error occurred',
    ...(isDev && { stack: err.stack }),
  });
}

/**
 * 404 handler for unmatched API routes
 */
export function notFoundHandler(req: Request, res: Response) {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found', path: req.path });
  }
}
