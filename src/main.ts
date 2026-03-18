import "dotenv/config";
import express, { Router } from "express";
import { UserController } from "./users/infra/user.controller";

const app = express();
app.use(express.json()); 

const router = Router();
const userController = UserController.build();

router.get("/", (req, res) => userController.get(req, res));
app.use(router);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});