ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_service_id_services_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "service_id";