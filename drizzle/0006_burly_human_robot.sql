CREATE TABLE "RateLimit" (
	"key" text PRIMARY KEY NOT NULL,
	"windowStart" timestamp (3) DEFAULT now() NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
