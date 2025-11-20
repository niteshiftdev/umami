-- CreateTable
CREATE TABLE "annotation" (
    "annotation_id" UUID NOT NULL,
    "website_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(1000),
    "color" VARCHAR(20),
    "icon" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "annotation_pkey" PRIMARY KEY ("annotation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "annotation_annotation_id_key" ON "annotation"("annotation_id");

-- CreateIndex
CREATE INDEX "annotation_website_id_timestamp_idx" ON "annotation"("website_id", "timestamp");
