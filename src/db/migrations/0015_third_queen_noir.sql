ALTER TABLE "validators" ADD COLUMN "base_api_url" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "validators" ADD CONSTRAINT "validators_base_api_url_unique" UNIQUE("base_api_url");