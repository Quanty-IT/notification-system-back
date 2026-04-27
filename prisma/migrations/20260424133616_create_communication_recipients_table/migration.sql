-- CreateTable
CREATE TABLE "communication_recipients" (
    "id" TEXT NOT NULL,
    "communication_id" TEXT NOT NULL,
    "recipient_type" VARCHAR(10) NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communication_recipients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "communication_recipients" ADD CONSTRAINT "communication_recipients_communication_id_fkey" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
