import "@/modules/auth/infra/auth.routes";
import "@/modules/users/infra/user.routes";

import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./swagger.registry";

const generator = new OpenApiGeneratorV3(registry.definitions);
export const swaggerDoc = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "Notification System API",
    version: "1.0.0",
  },
});