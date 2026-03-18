import { Request, Response } from "express";

export class UserController {
  public static build() {
    return new UserController();
  }
  
  public async get(request: Request, response: Response) {
    response.status(200).json({ message: "Hello World" }).send();
  }
}