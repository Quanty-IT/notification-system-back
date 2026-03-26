import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  // biome-ignore lint/suspicious/noExplicitAny: Express error middleware can receive errors of any shape (third-party libs, thrown values, etc.), so we intentionally use `any` to safely access dynamic properties like status and message.
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues,
    });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
}
