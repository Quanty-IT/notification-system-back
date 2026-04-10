-- CreateTable
CREATE TABLE "communications" (
    "id" TEXT NOT NULL,
    "channel" VARCHAR(20) NOT NULL,
    "source_type" VARCHAR(20) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "subject" VARCHAR(255),
    "body" TEXT,
    "body_type" VARCHAR(20),
    "template_version_id" TEXT,
    "template_variables_json" JSONB,
    "scheduled_at" TIMESTAMP(3),
    "queued_at" TIMESTAMP(3),
    "processing_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "communications_template_version_id_idx" ON "communications"("template_version_id");

-- CreateIndex
CREATE INDEX "communications_created_by_user_id_idx" ON "communications"("created_by_user_id");

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_template_version_id_fkey" FOREIGN KEY ("template_version_id") REFERENCES "template_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
