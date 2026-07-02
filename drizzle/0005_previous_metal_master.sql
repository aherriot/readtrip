ALTER TABLE "MapNode" ADD COLUMN "kind" text;--> statement-breakpoint
ALTER TABLE "MapNode" ADD COLUMN "createdAt" timestamp (3) DEFAULT now() NOT NULL;