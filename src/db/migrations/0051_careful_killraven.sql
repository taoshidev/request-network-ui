ALTER TABLE "subscriptions" ALTER COLUMN "active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "validator_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_validator_id_validators_id_fk" FOREIGN KEY ("validator_id") REFERENCES "validators"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
