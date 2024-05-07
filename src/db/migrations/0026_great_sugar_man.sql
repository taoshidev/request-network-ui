ALTER TABLE "endpoints" ADD COLUMN "wallet_address" varchar;--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "escrow_public_key";