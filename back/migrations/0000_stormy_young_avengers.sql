CREATE TYPE "public"."inventory_status" AS ENUM('INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK');--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image" text,
	"categorie" varchar(100),
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"reference" varchar(100),
	"shellid" integer,
	"inventory_status" "inventory_status" DEFAULT 'INSTOCK',
	"rating" numeric(2, 1),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
