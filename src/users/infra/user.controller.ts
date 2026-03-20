import { Request, Response } from "express";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "../application/user.schemas";
import { UserService } from "../application/user.service";

export class UserController {
  constructor(private readonly service: UserService) {}


  public async create(request: Request, response: Response) {
    const input = createUserSchema.parse(request.body);

    const output = await this.service.create(input);

    return response.status(201).json(output);
  }

  public async findAll(request: Request, response: Response) {
    const output = await this.service.findAll();

    return response.status(200).json(output);
  }

  public async findById(
    request: Request<{ id: string }>,
    response: Response
  ) {
    const { id } = userIdSchema.parse(request.params);

    const output = await this.service.findById(id);

    return response.status(200).json(output);
  }

  public async update(
    request: Request<{ id: string }>,
    response: Response
  ) {
    const input = updateUserSchema.parse({
      id: request.params.id,
      name: request.body.name,
    });

    const output = await this.service.update(input);

    return response.status(200).json(output);
  }

  public async delete(
    request: Request<{ id: string }>,
    response: Response
  ) {
    const { id } = userIdSchema.parse(request.params);

    await this.service.delete(id);

    return response.status(204).send();
  }
}