-- CreateTable
CREATE TABLE "public"."External_Links" (
    "uuid_link" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "display_name" TEXT,
    "model_target" TEXT NOT NULL,
    "uuid_target" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "External_Links_pkey" PRIMARY KEY ("uuid_link")
);

-- CreateIndex
CREATE INDEX "External_Links_model_target_uuid_target_purpose_idx" ON "public"."External_Links"("model_target", "uuid_target", "purpose");
