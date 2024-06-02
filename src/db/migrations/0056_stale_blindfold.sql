ALTER TABLE "subscriptions" ADD COLUMN "subnet_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subnet_id_subnets_id_fk" FOREIGN KEY ("subnet_id") REFERENCES "subnets"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
