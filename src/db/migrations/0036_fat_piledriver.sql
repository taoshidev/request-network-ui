ALTER TABLE "endpoints" ADD COLUMN "currency_type" varchar;--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN IF EXISTS "currency_type";