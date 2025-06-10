-- Create the archives table to store Excel file archives
CREATE TABLE IF NOT EXISTS "archives" (
  "id" text PRIMARY KEY,
  "file_name" text NOT NULL,
  "upload_date" timestamp NOT NULL,
  "file_size" integer NOT NULL,
  "content_type" text NOT NULL,
  "supabase_path" text,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Index on upload_date for faster querying by date
CREATE INDEX IF NOT EXISTS "archives_upload_date_idx" ON "archives" ("upload_date");
