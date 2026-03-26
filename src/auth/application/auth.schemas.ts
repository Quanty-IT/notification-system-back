import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const authSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string(),
});

export type AuthSchemaInput = z.infer<typeof authSchema>;