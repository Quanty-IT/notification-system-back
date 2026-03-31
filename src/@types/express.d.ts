import { AuthenticatedUser } from '@/modules/auth/domain/authenticated-user';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};