import { z } from "zod";
import { authSchema } from "./auth.schemas";

export type AuthInput = z.infer<typeof authSchema>;

export type AuthOutput = {
  accessToken: string;
};
