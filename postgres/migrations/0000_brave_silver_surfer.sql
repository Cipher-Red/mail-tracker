CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"phone" text,
	"address" text,
	"tags" text[],
	"added_at" timestamp DEFAULT now() NOT NULL,
	"last_contact" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "email_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"sent" integer DEFAULT 0 NOT NULL,
	"failed" integer DEFAULT 0 NOT NULL,
	"delivery_issues" text
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"preheader" text,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_order_number" text NOT NULL,
	"ship_to_name" text NOT NULL,
	"ship_to_phone" text,
	"ship_to_line1" text NOT NULL,
	"ship_to_city" text NOT NULL,
	"ship_to_state_province" text NOT NULL,
	"ship_to_postal_code" text NOT NULL,
	"order_total" integer NOT NULL,
	"actual_ship_date" timestamp NOT NULL,
	"tracking_numbers" text[],
	"order_source" text,
	"order_summary" text,
	"processed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sent_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"template_id" integer,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"status" text NOT NULL,
	"error_message" text
);
--> statement-breakpoint
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sent_emails" ADD CONSTRAINT "sent_emails_template_id_email_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."email_templates"("id") ON DELETE no action ON UPDATE no action;