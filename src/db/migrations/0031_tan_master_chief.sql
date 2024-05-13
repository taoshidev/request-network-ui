ALTER TABLE "contract" RENAME COLUMN "validator_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "contract" DROP CONSTRAINT "contract_validator_id_validators_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contract" ADD CONSTRAINT "contract_user_id_validators_id_fk" FOREIGN KEY ("user_id") REFERENCES "validators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
