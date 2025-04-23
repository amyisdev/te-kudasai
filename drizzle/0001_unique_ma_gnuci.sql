CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"reporter_id" text NOT NULL,
	"assignee_id" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" text NOT NULL,
	"form_id" text NOT NULL,
	"form" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reporter_id_idx" ON "tickets" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "assignee_id_idx" ON "tickets" USING btree ("assignee_id");--> statement-breakpoint
CREATE INDEX "form_id_idx" ON "tickets" USING btree ("form_id");