CREATE TYPE "public"."verified_state" AS ENUM('verified', 'partial', 'unverified', 'stale');--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "verified" "verified_state" DEFAULT 'unverified' NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "sources" jsonb;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "related_slugs" text[];--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "review_due_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_articles_verified" ON "articles" USING btree ("verified");--> statement-breakpoint
CREATE INDEX "idx_articles_review_due_at" ON "articles" USING btree ("review_due_at");