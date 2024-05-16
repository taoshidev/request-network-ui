ALTER TABLE "packages" ADD COLUMN "currency_type" "currency_type" DEFAULT 'USDC' NOT NULL;--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN IF EXISTS "currency_type";