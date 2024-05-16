ALTER TABLE "subscriptions" ALTER COLUMN "service_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "proxy_service_id" varchar;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "contract_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_contract_id_services_id_fk" FOREIGN KEY ("contract_id") REFERENCES "services"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
