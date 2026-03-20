import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof Error) {
    return response.status(400).json({
      message: error.message,
    });
  }

  return response.status(500).json({
    message: "Internal server error",
  });
}