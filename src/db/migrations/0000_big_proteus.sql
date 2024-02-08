CREATE TABLE IF NOT EXISTS "Consumers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fullname" varchar,
	"username" varchar,
	"phone" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Validators" (
	"id" uuid PRIMARY KEY NOT NULL,
	"endpoint" varchar,
	"vtrust" numeric(7, 5),
	"hotkey" varchar,
	"coldkey" varchar
);
