import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { authenticate, errorHandler } from './infra/middlewares';
import { swaggerDoc } from './infra/swagger/swagger.doc';
import { authRoutes } from './modules/auth/infra/auth.routes';
import { JsonWebTokenProvider } from './modules/auth/infra/jsonwebtoken.provider';
import { templateRoutes } from './modules/templates/infra/template.routes';
import { userRoutes } from './modules/users/infra/user.routes';

const app = express();
app.use(express.json());

const jwtProvider = new JsonWebTokenProvider(
  env.JWT_SECRET_KEY,
  env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  env.JWT_REFRESH_TOKEN_EXPIRES_IN,
);
const authMiddleware = authenticate(jwtProvider);

app.use('/auth', authRoutes(jwtProvider));
app.use('/users', authMiddleware, userRoutes());
app.use('/templates', authMiddleware, templateRoutes());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.info(`🚀 Server running on http://localhost:${PORT}`);
});
