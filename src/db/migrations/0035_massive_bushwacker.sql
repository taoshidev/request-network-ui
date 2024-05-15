CREATE TABLE IF NOT EXISTS "contract_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"package_id" uuid NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price" varchar,
	"currency_type" varchar,
	"limit" integer DEFAULT 10,
	"expires" timestamp,
	"refill_rate" integer DEFAULT 1,
	"refill_interval" integer DEFAULT 1000,
	"remaining" integer DEFAULT 1000,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN IF EXISTS "price";--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN IF EXISTS "currency_type";--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN IF EXISTS "limit";--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN IF EXISTS "expires";--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN IF EXISTS "refill_rate";--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN IF EXISTS "refill_interval";--> statement-breakpoint
ALTER TABLE "endpoints" DROP COLUMN IF EXISTS "remaining";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contract_packages" ADD CONSTRAINT "contract_packages_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contract_packages" ADD CONSTRAINT "contract_packages_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_wallet_address_unique" UNIQUE("wallet_address");