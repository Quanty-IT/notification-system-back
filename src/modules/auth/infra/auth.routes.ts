import { Router } from 'express';
import { ArgonProvider } from '@/infra/cryptography/argon.provider';
import { prisma } from '@/infra/database/prisma.client';
import { registry } from '@/infra/swagger/swagger.registry';
import { UserRepositoryPrisma } from '@/modules/users/infra/user.repository.prisma';
import { authSchema } from '../application/auth.schemas';
import { AuthService } from '../application/auth.service';
import { JwtProvider } from '../domain/jwt.provider';
import { AuthController } from './auth.controller';

const BASE_PATH = '/auth';
const TAG = 'Auth';

registry.register('AuthSignIn', authSchema);

registry.registerPath({
  method: 'post',
  path: `${BASE_PATH}/sign-in`,
  tags: [TAG],
  request: {
    body: {
      content: {
        'application/json': {
          schema: authSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User authenticated',
    },
    401: {
      description: 'Invalid credentials',
    },
  },
});

export const authRoutes = (jwtProvider: JwtProvider) => {
  const router = Router();

  const repository = new UserRepositoryPrisma(prisma);
  const hashProvider = new ArgonProvider();

  const service = new AuthService(repository, hashProvider, jwtProvider);
  const controller = new AuthController(service);

  router.post('/sign-in', controller.signIn.bind(controller));

  return router;
};
