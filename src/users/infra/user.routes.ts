import { Router } from "express";
import { UserController } from "./user.controller";

export const userRoutes = () => {
  const router = Router();
  const controller = UserController.build();

  router.get("/", (req, res) => controller.get(req, res));

  return router;
};