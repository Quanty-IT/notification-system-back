-- CreateTable
CREATE TABLE "communication_dispatches" (
    "id" TEXT NOT NULL,
    "communication_id" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "communication_dispatches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "communication_dispatches_communication_id_attempt_number_idx" ON "communication_dispatches"("communication_id", "attempt_number");

-- AddForeignKey
ALTER TABLE "communication_dispatches" ADD CONSTRAINT "communication_dispatches_communication_id_fkey" FOREIGN KEY ("communication_id") REFERENCES "communications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
