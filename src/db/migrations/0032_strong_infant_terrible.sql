ALTER TABLE "contract" RENAME TO "contracts";--> statement-breakpoint
ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_contract_id_contract_id_fk";
--> statement-breakpoint
ALTER TABLE "contracts" DROP CONSTRAINT "contract_user_id_validators_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
