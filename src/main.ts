import express from 'express';
import cors from 'cors';
import { authRoutes } from './modules/auth/infra/auth.routes'; // Adicionado o /infra/
import { templateRoutes } from './modules/templates/infra/template.routes';

const app = express();
app.use(express.json());
app.use(cors());


app.use('/auth', authRoutes());
app.use('/templates', templateRoutes());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  app.listen(3000, () => console.log('🚀 Server running!'));
  console.log(`📡 Template routes available at http://localhost:${PORT}/templates`);
});