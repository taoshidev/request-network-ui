ALTER TABLE "subnets" DROP CONSTRAINT "subnets_value_unique";--> statement-breakpoint
ALTER TABLE "subnets" DROP COLUMN IF EXISTS "value";