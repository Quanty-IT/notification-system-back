import { Request, Response } from "express";
import { prisma } from "../../infra/database/prisma.client";
import { UserService } from "../application/user.service";
import { UserRepositoryPrisma } from "./user.repository.prisma";

export class UserController {
  private readonly service: UserService;

  private constructor() {
    const repository = new UserRepositoryPrisma(prisma);
    this.service = new UserService(repository);
  }

  public static build() {
    return new UserController();
  }

  public async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const output = await this.service.create({
      name,
      email,
      password,
    });

    response.status(201).json(output).send();
  }

  public async findAll(request: Request, response: Response) {
    const output = await this.service.findAll();

    response.status(200).json(output).send();
  }

  public async findById(request: Request<{ id: string }>, response: Response) {
    const { id } = request.params;
    if (!id) {
      return response.status(400).json({ message: "Id is required" });
    }

    const output = await this.service.findById(id);

    response.status(200).json(output).send();
  }

  public async update(request: Request<{ id: string }>, response: Response) {
    const { id } = request.params;
    if (!id) {
      return response.status(400).json({ message: "Id is required" });
    }
    
    const { name } = request.body;

    const output = await this.service.update({
      id,
      name,
    });

    response.status(200).json(output).send();
  }

  public async delete(request: Request<{ id: string }>, response: Response) {
    const { id } = request.params;
    if (!id) {
      return response.status(400).json({ message: "Id is required" });
    }

    await this.service.delete(id);

    response.status(204).send();
  }
}