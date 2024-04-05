ALTER TABLE "subscriptions" RENAME COLUMN "key" TO "api_key";--> statement-breakpoint
ALTER TABLE "validators" RENAME COLUMN "apiId" TO "api_id";--> statement-breakpoint
ALTER TABLE "validators" RENAME COLUMN "apiKey" TO "api_key";--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "api_secret" varchar;--> statement-breakpoint
ALTER TABLE "validators" ADD COLUMN "api_secret" varchar;