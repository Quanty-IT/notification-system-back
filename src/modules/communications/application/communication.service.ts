import createHttpError from "http-errors";

import { CommunicationRepository } from "../domain/communication.repository";
import { CommunicationEntity } from "../domain/communication.entity";
import { TemplateVersionRepository } from "@/modules/template-versions/domain/template-version.repository";
import { UserRepository } from "@/modules/users/domain/user.repository";
import {
  CreateCommunicationInput,
  CreateCommunicationOutput,
  UpdateCommunicationInput,
  UpdateCommunicationOutput,
  GetCommunicationOutput,
  FindCommunicationsOutput,
} from "./communication.dto";

export class CommunicationService {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly templateVersionRepository: TemplateVersionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    input: CreateCommunicationInput,
    createdByUserId: string,
  ): Promise<CreateCommunicationOutput> {
    if (input.sourceType === "template") {
      if (!input.templateVersionId) {
        throw new createHttpError.BadRequest(
          "Template version ID is required when source type is template",
        );
      }

      const templateVersionExists =
        await this.templateVersionRepository.findById(input.templateVersionId);
      if (!templateVersionExists) {
        throw new createHttpError.NotFound(
          `Template version ${input.templateVersionId} not found`,
        );
      }

      if (templateVersionExists.variablesSchemaJson && !input.templateVariablesJson) {
        throw new createHttpError.BadRequest(
          "Template variables JSON is required when template has variables",
        );
      }

      if (templateVersionExists.variablesSchemaJson && input.templateVariablesJson) {
        const templateVariables = Object.keys(templateVersionExists.variablesSchemaJson);
        const providedVariables = Object.keys(input.templateVariablesJson);
        
        const missingVariables = templateVariables.filter(
          variable => !providedVariables.includes(variable)
        );
        
        if (missingVariables.length > 0) {
          throw new createHttpError.BadRequest(
            `Missing required template variables: ${missingVariables.join(', ')}`
          );
        }
      }
    }

    const communication = CommunicationEntity.create(
      input.channel,
      input.sourceType,
      input.status,
      input.subject,
      input.body,
      input.bodyType,
      input.templateVersionId,
      input.templateVariablesJson,
      input.scheduledAt,
            createdByUserId,
    );

    await this.repository.create(communication);

    return this.toOutput(communication);
  }

  async findAll(): Promise<FindCommunicationsOutput> {
    const communications = await this.repository.findAll();

    return {
      communications: communications.map((communication) =>
        this.toOutput(communication),
      ),
    };
  }

  async findById(id: string): Promise<GetCommunicationOutput> {
    const communication = await this.repository.findById(id);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${id} not found`);
    }

    return this.toOutput(communication);
  }

  async update(
    id: string,
    input: UpdateCommunicationInput,
  ): Promise<UpdateCommunicationOutput> {
    const communication = await this.repository.findById(id);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${id} not found`);
    }

    if (input.templateVersionId !== undefined) {
      if (communication.sourceType === "template" && !input.templateVersionId) {
        throw new createHttpError.BadRequest(
          "Template version ID is required for template source type",
        );
      }

      if (
        input.templateVersionId !== undefined &&
        input.templateVersionId !== null
      ) {
        const templateVersionExists =
          await this.templateVersionRepository.findById(
            input.templateVersionId,
          );
        if (!templateVersionExists) {
          throw new createHttpError.NotFound(
            `Template version ${input.templateVersionId} not found`,
          );
        }
      }
    }

    if (input.templateVariablesJson !== undefined) {
      if (
        communication.sourceType === "template" &&
        !input.templateVariablesJson &&
        communication.templateVersionId
      ) {
        throw new createHttpError.BadRequest(
          "Template variables JSON is required for template source type",
        );
      }
    }

    if (input.subject !== undefined) {
      if (input.subject !== null) {
        communication.updateSubject(input.subject);
      }
    }

    if (input.body !== undefined || input.bodyType !== undefined) {
      if (communication.sourceType === "template") {
        throw new createHttpError.BadRequest(
          "body and bodyType can only be updated for manual communications"
        );
      }
    }

    if (input.body !== undefined) {
      if (input.body !== null) {
        communication.updateBody(input.body);
      }
    }

    if (input.bodyType !== undefined) {
      if (input.bodyType !== null) {
        communication.updateBodyType(input.bodyType);
      }
    }

    if (input.templateVariablesJson !== undefined) {
      if (communication.sourceType === "manual") {
        throw new createHttpError.BadRequest(
          "templateVariablesJson can only be updated for template communications"
        );
      }
    }

    if (input.templateVariablesJson !== undefined) {
      if (input.templateVariablesJson !== null) {
        communication.updateTemplateVariables(input.templateVariablesJson);
      }
    }

    if (input.scheduledAt !== undefined) {
      if (input.scheduledAt !== null) {
        communication.updateScheduledAt(input.scheduledAt);
      }
    }

    await this.repository.update(communication);

    return this.toOutput(communication);
  }

  async delete(id: string): Promise<void> {
    const communication = await this.repository.findById(id);

    if (!communication) {
      throw new createHttpError.NotFound(`Communication ${id} not found`);
    }

    await this.repository.delete(id);
  }

  private toOutput(communication: CommunicationEntity): GetCommunicationOutput {
    return {
      id: communication.id,
      channel: communication.channel,
      sourceType: communication.sourceType,
      status: communication.status,
      subject: communication.subject,
      body: communication.body,
      bodyType: communication.bodyType,
      templateVersionId: communication.templateVersionId,
      templateVariablesJson: communication.templateVariablesJson,
      scheduledAt: communication.scheduledAt,
      processingAt: communication.processingAt,
      sentAt: communication.sentAt,
      createdByUserId: communication.createdByUserId,
      createdAt: communication.createdAt,
      updatedAt: communication.updatedAt,
    };
  }
}
