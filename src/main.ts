import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './infra/middlewares/error-handler';
import { swaggerDoc } from './infra/swagger/swagger.doc';
import { authRoutes } from './modules/auth/infra/auth.routes';
import { userRoutes } from './modules/users/infra/user.routes';

const app = express();
app.use(express.json());

app.use('/users', userRoutes());
app.use('/auth', authRoutes());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.info(`🚀 Server running on http://localhost:${PORT}`);
});
