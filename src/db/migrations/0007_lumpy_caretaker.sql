ALTER TABLE "subnets" ALTER COLUMN "value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subnets" ADD CONSTRAINT "subnets_value_unique" UNIQUE("value");