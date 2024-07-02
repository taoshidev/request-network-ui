ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_validator_id_url_unique";--> statement-breakpoint
ALTER TABLE "endpoints" ADD COLUMN "percent_realtime" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_validator_id_url_percent_realtime_unique" UNIQUE("validator_id","url","percent_realtime");