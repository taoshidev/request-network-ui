ALTER TABLE "validators" ALTER COLUMN "stripe_enabled" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "auth"."users" ADD COLUMN "crypto_enabled" boolean DEFAULT false;