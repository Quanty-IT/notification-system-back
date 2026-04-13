import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const templateVariableValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
]);

export const templateVariablesJsonSchema = z
  .record(z.string(), templateVariableValueSchema)
  .nullable();

export const createCommunicationSchema = z
  .object({
    channel: z.enum(["email", "whatsapp", "sms", "teams"]),
    sourceType: z.enum(["manual", "template"]),
    status: z
      .enum([
        "draft",
        "scheduled",
        "queued",
        "processing",
        "sent",
        "failed",
        "canceled",
      ])
      .default("draft"),
    subject: z.string().max(255).nullable().optional(),
    body: z.string().nullable().optional(),
    bodyType: z.enum(["text", "html"]).nullable().optional(),
    templateVersionId: z.string().nullable().optional(),
    templateVariablesJson: templateVariablesJsonSchema,
    scheduledAt: z.date().nullable().optional(),
    queuedAt: z.date().nullable(),
    processingAt: z.date().nullable(),
    sentAt: z.date().nullable(),
    createdByUserId: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.sourceType === "template") {
        return (
          data.templateVersionId !== null &&
          data.templateVersionId !== undefined
        );
      }
      return true;
    },
    {
      message: "templateVersionId is required when sourceType is template",
      path: ["templateVersionId"],
    },
  )
  .refine(
    (data) => {
      if (data.templateVersionId && !data.templateVariablesJson) {
        return false;
      }
      return true;
    },
    {
      message:
        "templateVariablesJson is required when templateVersionId is provided",
      path: ["templateVariablesJson"],
    },
  );

export const updateCommunicationSchema = z.object({
  subject: z
    .string()
    .max(255, "Subject must have at most 255 characters")
    .nullable()
    .optional(),
  body: z.string().nullable().optional(),
  bodyType: z.enum(["text", "html"]).nullable().optional(),
  templateVersionId: z.string().nullable().optional(),
  templateVariablesJson: templateVariablesJsonSchema,
  scheduledAt: z.coerce.date().nullable().optional(),
});

export const communicationIdSchema = z.object({
  id: z.uuid("Invalid UUID"),
});

export type CreateCommunicationSchemaInput = z.infer<
  typeof createCommunicationSchema
>;
export type UpdateCommunicationSchemaInput = z.infer<
  typeof updateCommunicationSchema
>;
export type CommunicationIdSchemaInput = z.infer<typeof communicationIdSchema>;
