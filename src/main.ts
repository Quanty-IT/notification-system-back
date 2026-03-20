import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { errorHandler } from "./infra/http/middlewares/error-handler";
import { swaggerDoc } from "./infra/http/swagger/swagger.doc";
import { userRoutes } from "./users/infra/user.routes";

const app = express();
app.use(express.json());

app.use("/users", userRoutes());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});