CREATE SCHEMA "auth";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('consumer', 'validator');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "endpoints" (
	"id" uuid PRIMARY KEY NOT NULL,
	"subnet" uuid NOT NULL,
	"validator" uuid NOT NULL,
	"limit" integer DEFAULT 10,
	"url" varchar NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"expires" timestamp,
	"refill_rate" integer DEFAULT 1,
	"refill_interval" integer DEFAULT 1000,
	"remaining" integer DEFAULT 1000,
	CONSTRAINT "endpoints_validator_subnet_unique" UNIQUE("validator","subnet")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subnets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"label" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" "role" DEFAULT 'consumer' NOT NULL,
	"email" varchar(255),
	"fullname" varchar,
	"username" varchar,
	"phone" varchar(256),
	"onboarded" boolean DEFAULT false NOT NULL,
	"onboardingStep" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "validators" (
	"id" uuid PRIMARY KEY NOT NULL,
	"hotkey" varchar(48) NOT NULL,
	"subnet_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"account" jsonb,
	"signature" varchar,
	"vtrust" numeric(7, 5),
	"verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "validators_hotkey_unique" UNIQUE("hotkey")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_subnet_subnets_id_fk" FOREIGN KEY ("subnet") REFERENCES "subnets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_validator_validators_id_fk" FOREIGN KEY ("validator") REFERENCES "validators"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validators" ADD CONSTRAINT "validators_subnet_id_subnets_id_fk" FOREIGN KEY ("subnet_id") REFERENCES "subnets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "validators" ADD CONSTRAINT "validators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
