DO $$ BEGIN
 CREATE TYPE "payment_type" AS ENUM('FREE', 'SUBSCRIPTION', 'PAY_PER_REQUEST');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "services_contract_id_contracts_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "from_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "payment_type" "payment_type" DEFAULT 'FREE' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "tiers" jsonb;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
