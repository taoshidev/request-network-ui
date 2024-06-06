ALTER TABLE "subscriptions" ADD COLUMN "agreed_to_tos" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "validators" ADD COLUMN "agreed_to_tos" boolean DEFAULT false;