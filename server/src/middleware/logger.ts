import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const sanitizedQuery = Object.keys(req.query).length ? `?${new URLSearchParams(req.query as Record<string, string>).toString()}` : '';
    console.log(`[${new Date().toISOString()}] ${method} ${url}${sanitizedQuery} -> ${status} (${duration}ms)`);
  });

  next();
};
