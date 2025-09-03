import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const extractionResults = pgTable("extraction_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalUrl: text("original_url").notNull(),
  extractedId: text("extracted_id"),
  urlType: text("url_type").notNull(), // 'group' | 'channel' | 'unknown'
  status: text("status").notNull(), // 'success' | 'error'
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExtractionResultSchema = createInsertSchema(extractionResults).omit({
  id: true,
  createdAt: true,
});

export type InsertExtractionResult = z.infer<typeof insertExtractionResultSchema>;
export type ExtractionResult = typeof extractionResults.$inferSelect;

// WhatsApp URL extraction types
export const whatsappUrlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export const batchUrlSchema = z.object({
  urls: z.array(z.string().url()).min(1, "At least one valid URL is required"),
});

export type WhatsappUrlInput = z.infer<typeof whatsappUrlSchema>;
export type BatchUrlInput = z.infer<typeof batchUrlSchema>;

export interface ExtractionResponse {
  originalUrl: string;
  extractedId: string | null;
  urlType: 'group' | 'channel' | 'unknown';
  status: 'success' | 'error';
  errorMessage?: string;
}
