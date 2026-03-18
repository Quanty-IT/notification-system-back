import "dotenv/config";
import express from "express";
import { userRoutes } from "./users/infra/user.routes";

const app = express();
app.use(express.json());

app.use("/users", userRoutes());

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});