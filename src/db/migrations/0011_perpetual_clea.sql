ALTER TABLE "endpoints" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "auth"."users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "validators" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();