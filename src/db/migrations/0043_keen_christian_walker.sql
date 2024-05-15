DROP TABLE "contract_packages";--> statement-breakpoint
ALTER TABLE "packages" RENAME TO "services";--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "packages_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "validators" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "contract_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "validators" ADD CONSTRAINT "validators_name_unique" UNIQUE("name");