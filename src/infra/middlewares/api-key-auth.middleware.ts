import { NextFunction, Request, RequestHandler, Response } from 'express';
import createHttpError from 'http-errors';
import { Environment, env } from '@/config/env';

export const apiKeyAuth = (): RequestHandler => {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (env.NODE_ENV === Environment.DEV) {
      return next();
    }

    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new createHttpError.Unauthorized('Missing API key.');
    }

    if (apiKey !== env.API_KEY) {
      throw new createHttpError.Unauthorized('Invalid API key.');
    }

    return next();
  };
};
