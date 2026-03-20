import { registry } from "@/infra/http/swagger/swagger.registry";
import { Router } from "express";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "../application/user.schemas";
import { UserController } from "./user.controller";

const controller = UserController.build();
const BASE_PATH = "/users";
const TAG = "Users";

registry.register("CreateUser", createUserSchema);
registry.register("UpdateUser", updateUserSchema);
registry.register("UserId", userIdSchema);

registry.registerPath({
  method: "post",
  path: BASE_PATH,
  tags: [TAG],
  request: {
    body: {
      content: {
        "application/json": {
          schema: createUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User created",
    },
  },
});

registry.registerPath({
  method: "get",
  path: BASE_PATH,
  tags: [TAG],
  responses: {
    200: {
      description: "List users",
    },
  },
});

registry.registerPath({
  method: "get",
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  request: {
    params: userIdSchema,
  },
  responses: {
    200: {
      description: "User found",
    },
  },
});

registry.registerPath({
  method: "put",
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  request: {
    params: userIdSchema,
    body: {
      content: {
        "application/json": {
          schema: updateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User updated",
    },
  },
});

registry.registerPath({
  method: "delete",
  path: `${BASE_PATH}/{id}`,
  tags: [TAG],
  request: {
    params: userIdSchema,
  },
  responses: {
    204: {
      description: "User deleted",
    },
  },
});

export const userRoutes = () => {
  const router = Router();

  router.post("/", controller.create.bind(controller));
  router.get("/", controller.findAll.bind(controller));
  router.get("/:id", controller.findById.bind(controller));
  router.put("/:id", controller.update.bind(controller));
  router.delete("/:id", controller.delete.bind(controller));

  return router;
};