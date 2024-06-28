ALTER TABLE "auth"."users" ADD COLUMN "paypal_enabled" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "validators" ADD COLUMN "paypal_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "validators" ADD COLUMN "paypal_live_mode" boolean DEFAULT false;