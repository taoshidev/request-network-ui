ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_wallet_address_unique";--> statement-breakpoint
ALTER TABLE "services" DROP CONSTRAINT "services_contract_id_contracts_id_fk";
--> statement-breakpoint
ALTER TABLE "validators" ADD COLUMN "wallet_address" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN IF EXISTS "wallet_address";--> statement-breakpoint
ALTER TABLE "validators" ADD CONSTRAINT "validators_wallet_address_unique" UNIQUE("wallet_address");