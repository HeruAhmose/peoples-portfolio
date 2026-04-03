CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'read', 'replied');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320) NOT NULL,
	"subject" varchar(512) NOT NULL,
	"body" text NOT NULL,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notificationPreferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"visitorKey" varchar(64) NOT NULL,
	"email" varchar(320),
	"notifySectionExplores" integer DEFAULT 1 NOT NULL,
	"notifyInquiries" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notificationPreferences_visitorKey_unique" UNIQUE("visitorKey")
);
--> statement-breakpoint
CREATE TABLE "timelineEvents" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" varchar(64) NOT NULL,
	"title" varchar(512) NOT NULL,
	"detail" text,
	"payload" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "visitorEvents" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" varchar(64) NOT NULL,
	"eventType" varchar(64) NOT NULL,
	"section" varchar(128) NOT NULL,
	"metadata" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
