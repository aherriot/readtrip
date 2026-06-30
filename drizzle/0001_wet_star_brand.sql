CREATE TABLE "Account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "Account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "Badge" (
	"id" text PRIMARY KEY NOT NULL,
	"childId" text NOT NULL,
	"topicSlug" text NOT NULL,
	"title" text NOT NULL,
	"earnedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "Badge_childId_topicSlug_unique" UNIQUE("childId","topicSlug")
);
--> statement-breakpoint
CREATE TABLE "Child" (
	"id" text PRIMARY KEY NOT NULL,
	"parentId" text NOT NULL,
	"displayName" text NOT NULL,
	"avatarConfig" jsonb NOT NULL,
	"readingLevel" integer DEFAULT 3 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"recentQuizScores" jsonb NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "LearningSession" (
	"id" text PRIMARY KEY NOT NULL,
	"childId" text NOT NULL,
	"startedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "LlmCallLog" (
	"id" text PRIMARY KEY NOT NULL,
	"childId" text,
	"task" text NOT NULL,
	"model" text NOT NULL,
	"inputTokens" integer NOT NULL,
	"outputTokens" integer NOT NULL,
	"cacheReadTokens" integer DEFAULT 0 NOT NULL,
	"cacheCreateTokens" integer DEFAULT 0 NOT NULL,
	"latencyMs" integer NOT NULL,
	"costUsd" double precision NOT NULL,
	"safetyFlag" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Loop" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionId" text NOT NULL,
	"parentLoopId" text,
	"rawQuery" text,
	"intent" text NOT NULL,
	"topicSlug" text NOT NULL,
	"readingLevel" integer NOT NULL,
	"lessonText" text NOT NULL,
	"quizJson" jsonb NOT NULL,
	"quizPct" double precision,
	"xpAwarded" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "MapNode" (
	"id" text PRIMARY KEY NOT NULL,
	"childId" text NOT NULL,
	"topicSlug" text NOT NULL,
	"title" text NOT NULL,
	"status" text NOT NULL,
	"neighbors" jsonb NOT NULL,
	CONSTRAINT "MapNode_childId_topicSlug_unique" UNIQUE("childId","topicSlug")
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TopicProgress" (
	"id" text PRIMARY KEY NOT NULL,
	"childId" text NOT NULL,
	"topicSlug" text NOT NULL,
	"title" text NOT NULL,
	"visits" integer DEFAULT 0 NOT NULL,
	"bestQuizPct" double precision DEFAULT 0 NOT NULL,
	"mastered" boolean DEFAULT false NOT NULL,
	"lastVisited" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "TopicProgress_childId_topicSlug_unique" UNIQUE("childId","topicSlug")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp (3),
	"image" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "VerificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp (3) NOT NULL,
	CONSTRAINT "VerificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_childId_Child_id_fk" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Child" ADD CONSTRAINT "Child_parentId_User_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LearningSession" ADD CONSTRAINT "LearningSession_childId_Child_id_fk" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "LlmCallLog" ADD CONSTRAINT "LlmCallLog_childId_Child_id_fk" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Loop" ADD CONSTRAINT "Loop_sessionId_LearningSession_id_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."LearningSession"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Loop" ADD CONSTRAINT "Loop_parentLoopId_Loop_id_fk" FOREIGN KEY ("parentLoopId") REFERENCES "public"."Loop"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "MapNode" ADD CONSTRAINT "MapNode_childId_Child_id_fk" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TopicProgress" ADD CONSTRAINT "TopicProgress_childId_Child_id_fk" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE cascade ON UPDATE no action;