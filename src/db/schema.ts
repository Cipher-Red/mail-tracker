import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

// Email Templates table
export const emailTemplates = pgTable('email_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  preheader: text('preheader'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Customers table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  phone: text('phone'),
  address: text('address'),
  tags: text('tags').array(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
  lastContact: timestamp('last_contact'),
  notes: text('notes'),
});

// Sent Emails table
export const sentEmails = pgTable('sent_emails', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  templateId: integer('template_id').references(() => emailTemplates.id),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  status: text('status').notNull(), // 'sent', 'failed', 'pending'
  errorMessage: text('error_message'),
});

// Order Data table
export const orderData = pgTable('order_data', {
  id: serial('id').primaryKey(),
  customerOrderNumber: text('customer_order_number').notNull(),
  shipToName: text('ship_to_name').notNull(),
  shipToPhone: text('ship_to_phone'),
  shipToLine1: text('ship_to_line1').notNull(),
  shipToCity: text('ship_to_city').notNull(),
  shipToStateProvince: text('ship_to_state_province').notNull(),
  shipToPostalCode: text('ship_to_postal_code').notNull(),
  orderTotal: integer('order_total').notNull(),
  actualShipDate: timestamp('actual_ship_date').notNull(),
  trackingNumbers: text('tracking_numbers').array(),
  orderSource: text('order_source'),
  orderSummary: text('order_summary'),
  processedAt: timestamp('processed_at').defaultNow().notNull(),
});

// Email Analytics table
export const emailAnalytics = pgTable('email_analytics', {
  id: serial('id').primaryKey(),
  date: timestamp('date').defaultNow().notNull(),
  sent: integer('sent').notNull().default(0),
  failed: integer('failed').notNull().default(0),
  deliveryIssues: text('delivery_issues'),
});

// Define types for select and insert operations
export type EmailTemplate = InferSelectModel<typeof emailTemplates>;
export type NewEmailTemplate = InferInsertModel<typeof emailTemplates>;

export type Customer = InferSelectModel<typeof customers>;
export type NewCustomer = InferInsertModel<typeof customers>;

export type SentEmail = InferSelectModel<typeof sentEmails>;
export type NewSentEmail = InferInsertModel<typeof sentEmails>;

export type OrderData = InferSelectModel<typeof orderData>;
export type NewOrderData = InferInsertModel<typeof orderData>;

export type EmailAnalytic = InferSelectModel<typeof emailAnalytics>;
export type NewEmailAnalytic = InferInsertModel<typeof emailAnalytics>;
