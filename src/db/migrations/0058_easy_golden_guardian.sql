ALTER TABLE "auth"."users" ALTER COLUMN "stripe_enabled" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "validators" ADD COLUMN "stripe_enabled" boolean DEFAULT false;