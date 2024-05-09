ALTER TABLE "endpoints" RENAME COLUMN "subnet" TO "subnet_id";--> statement-breakpoint
ALTER TABLE "endpoints" RENAME COLUMN "validator" TO "validator_id";--> statement-breakpoint
ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_url_unique";--> statement-breakpoint
ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_validator_subnet_unique";--> statement-breakpoint
ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_subnet_subnets_id_fk";
--> statement-breakpoint
ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_validator_validators_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_subnet_id_subnets_id_fk" FOREIGN KEY ("subnet_id") REFERENCES "subnets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_validator_id_validators_id_fk" FOREIGN KEY ("validator_id") REFERENCES "validators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_validator_id_subnet_id_unique" UNIQUE("validator_id","subnet_id");