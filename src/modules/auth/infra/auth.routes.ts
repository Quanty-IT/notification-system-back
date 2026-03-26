import { env } from "@/config/env";
import { ArgonProvider } from "@/infra/cryptography/argon.provider";
import { prisma } from "@/infra/database/prisma.client";
import { registry } from "@/infra/swagger/swagger.registry";
import { UserRepositoryPrisma } from "@/modules/users/infra/user.repository.prisma";
import { Router } from "express";
import { authSchema } from "../application/auth.schemas";
import { AuthService } from "../application/auth.service";
import { AuthController } from "./auth.controller";
import { JsonWebTokenProvider } from "./jsonwebtoken.provider";

const BASE_PATH = "/auth";
const TAG = "Auth";

registry.register("AuthSignIn", authSchema);

registry.registerPath({
  method: "post",
  path: `${BASE_PATH}/sign-in`,
  tags: [TAG],
  request: {
    body: {
      content: {
        "application/json": {
          schema: authSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User authenticated",
    },
    401: {
      description: "Invalid credentials",
    },
  },
});

export const authRoutes = () => {
  const router = Router();

  const repository = new UserRepositoryPrisma(prisma);
  const hashProvider = new ArgonProvider();
  const jwtProvider = new JsonWebTokenProvider(env.JWT_SECRET_KEY, env.JWT_EXPIRES_IN);

  const service = new AuthService(repository, hashProvider, jwtProvider);
  const controller = new AuthController(service);

  router.post("/sign-in", controller.signIn.bind(controller));

  return router;
};