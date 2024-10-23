CREATE TABLE IF NOT EXISTS "ai_shorts_account" (
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
	CONSTRAINT "ai_shorts_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_shorts_authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "ai_shorts_authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "ai_shorts_authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_shorts_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_shorts_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"username" text,
	"email" text,
	"emailVerified" timestamp,
	"imageUrl" varchar,
	"subscription" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "ai_shorts_user_username_unique" UNIQUE("username"),
	CONSTRAINT "ai_shorts_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_shorts_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "ai_shorts_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_shorts_account" ADD CONSTRAINT "ai_shorts_account_userId_ai_shorts_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ai_shorts_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_shorts_authenticator" ADD CONSTRAINT "ai_shorts_authenticator_userId_ai_shorts_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ai_shorts_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_shorts_session" ADD CONSTRAINT "ai_shorts_session_userId_ai_shorts_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."ai_shorts_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
