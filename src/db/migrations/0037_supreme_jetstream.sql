DO $$ BEGIN
 CREATE TYPE "currency_type" AS ENUM('FIAT', 'USDC', 'USDT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "endpoints" ALTER COLUMN "currency_type" SET DATA TYPE currency_type;--> statement-breakpoint
ALTER TABLE "endpoints" ALTER COLUMN "currency_type" SET DEFAULT 'USDC';--> statement-breakpoint
ALTER TABLE "endpoints" ALTER COLUMN "currency_type" SET NOT NULL;