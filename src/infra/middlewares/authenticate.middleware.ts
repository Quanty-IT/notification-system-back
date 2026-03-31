import { NextFunction, Request, RequestHandler, Response } from 'express';
import createHttpError from 'http-errors';
import { JwtProvider } from '@/modules/auth/domain/jwt.provider';

export const authenticate = (jwtProvider: JwtProvider): RequestHandler => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new createHttpError.Unauthorized('Missing bearer token.');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new createHttpError.Unauthorized('Invalid bearer token.');
    }

    try {
      const payload = await jwtProvider.verify(token);

      request.user = {
        id: payload.sub,
        email: payload.email,
      };

      next();
    } catch {
      throw new createHttpError.Unauthorized('Invalid bearer token.');
    }
  };
};
