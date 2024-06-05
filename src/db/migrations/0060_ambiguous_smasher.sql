ALTER TABLE "contracts" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "contracts" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "endpoints" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "endpoints" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "endpoints" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "subnets" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "subnets" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "subnets" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "user_notifications" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "user_notifications" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "user_notifications" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "validators" ALTER COLUMN "hotkey" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "validators" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "validators" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "validators" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_app_name_unique" UNIQUE("app_name");