ALTER TABLE "validators" DROP CONSTRAINT "validators_subnet_id_subnets_id_fk";
--> statement-breakpoint
ALTER TABLE "validators" DROP COLUMN IF EXISTS "subnet_id";