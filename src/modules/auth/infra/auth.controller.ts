import { Request, Response } from "express";
import { authSchema } from "../application/auth.schemas";
import { AuthService } from "../application/auth.service";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  public async signIn(request: Request, response: Response) {
    const input = authSchema.parse(request.body);

    const output = await this.service.signIn(input);

    return response.status(200).json(output);
  }
}