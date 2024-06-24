ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_app_name_unique";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_endpoint_id_user_id_unique";--> statement-breakpoint
ALTER TABLE "endpoints" ALTER COLUMN "enabled" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_endpoint_id_user_id_deleted_at_unique" UNIQUE("endpoint_id","user_id","deleted_at");