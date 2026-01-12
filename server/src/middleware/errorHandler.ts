import { Request, Response, NextFunction } from 'express';

interface ErrorWithCode extends Error {
  code?: string;
  statusCode?: number;
}

export function errorHandler(
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Internal server error';

  console.error(`[ERROR] ${code}:`, message);

  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
}
