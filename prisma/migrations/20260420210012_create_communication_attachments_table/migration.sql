-- CreateTable
CREATE TABLE "communication_attachments" (
    "id" TEXT NOT NULL,
    "communication_id" TEXT NOT NULL,
    "original_file_name" VARCHAR(255) NOT NULL,
    "storage_provider" VARCHAR(30) NOT NULL,
    "storage_key" VARCHAR(500) NOT NULL,
    "mime_type" VARCHAR(120) NOT NULL,
    "file_size_bytes" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communication_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "communication_attachments_communication_id_idx" ON "communication_attachments"("communication_id");

-- AddForeignKey
ALTER TABLE "communication_attachments" ADD CONSTRAINT "communication_attachments_communication_id_fkey" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
