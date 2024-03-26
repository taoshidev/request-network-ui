CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_subnet_subnets_id_fk";
--> statement-breakpoint
ALTER TABLE "validators" DROP CONSTRAINT "validators_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "validators" ADD COLUMN "name" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_subnet_subnets_id_fk" FOREIGN KEY ("subnet") REFERENCES "subnets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validators" ADD CONSTRAINT "validators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_endpoint_id_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "endpoints"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
