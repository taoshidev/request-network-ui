ALTER TABLE "validators" DROP COLUMN IF EXISTS "vtrust";--> statement-breakpoint
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_url_unique" UNIQUE("url");