ALTER TABLE "endpoints" ALTER COLUMN "contract_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "validator_id" DROP NOT NULL;