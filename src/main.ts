import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { cronJobs } from './infra/cron';
import { apiKeyAuth, bearerAuth, errorHandler } from './infra/middlewares';
import { swaggerDoc } from './infra/swagger/swagger.doc';
import { authRoutes } from './modules/auth/infra/auth.routes';
import { JsonWebTokenProvider } from './modules/auth/infra/jsonwebtoken.provider';
import { communicationRoutes } from './modules/communications/infra/communication.routes';
import { templateVersionRoutes } from './modules/template-versions/infra/template-version.routes';
import { templateRoutes } from './modules/templates/infra/template.routes';
import { userRoutes } from './modules/users/infra/user.routes';

const app = express();
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
};

app.use(cors(corsOptions));
app.use(express.json());

const jwtProvider = new JsonWebTokenProvider(
  env.JWT_SECRET_KEY,
  env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  env.JWT_REFRESH_TOKEN_EXPIRES_IN,
);
const bearerAuthMiddleware = bearerAuth(jwtProvider);
const apiKeyAuthMiddleware = apiKeyAuth();

app.use('/auth', apiKeyAuthMiddleware, authRoutes(jwtProvider));
app.use('/users', apiKeyAuthMiddleware, bearerAuthMiddleware, userRoutes());
app.use('/templates', apiKeyAuthMiddleware, bearerAuthMiddleware, templateRoutes());
app.use('/template-versions', apiKeyAuthMiddleware, bearerAuthMiddleware, templateVersionRoutes());
app.use('/communications', apiKeyAuthMiddleware, bearerAuthMiddleware, communicationRoutes());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(errorHandler);

cronJobs.start();

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.info(`🚀 Server running on http://localhost:${PORT}`);
  console.info('📧 CRON jobs iniciadas - processando dispatches a cada minuto');
});
