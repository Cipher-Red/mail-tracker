import { pgTable, serial, text, integer, jsonb, timestamp, boolean, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// -------------------- SCHEMA DEFINITION --------------------

// Customers table
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  company: text('company'),
  phone: text('phone'),
  address: text('address'),
  tags: jsonb('tags').$type<string[]>().default([]),
  notes: text('notes'),
  addedAt: timestamp('added_at').defaultNow().notNull(),
  lastContact: timestamp('last_contact'),
});

// Email templates table
export const emailTemplates = pgTable('email_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  preheader: text('preheader'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerOrderNumber: text('customer_order_number').notNull().unique(),
  orderTotal: numeric('order_total', { precision: 10, scale: 2 }).notNull(),
  actualShipDate: timestamp('actual_ship_date').notNull(),
  orderSource: text('order_source'),
  orderSummary: text('order_summary'),
  orderStatus: text('order_status').default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Shipping addresses table
export const shippingAddresses = pgTable('shipping_addresses', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  shipToName: text('ship_to_name').notNull(),
  shipToPhone: text('ship_to_phone'),
  shipToEmail: text('ship_to_email'),
  shipToLine1: text('ship_to_line1').notNull(),
  shipToCity: text('ship_to_city').notNull(),
  shipToStateProvince: text('ship_to_state_province').notNull(),
  shipToPostalCode: text('ship_to_postal_code').notNull(),
});

// Tracking information table
export const trackingInfo = pgTable('tracking_info', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  trackingNumber: text('tracking_number').notNull(),
  carrier: text('carrier').default('FedEx'),
  status: text('status').default('shipped'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Email analytics table
export const emailAnalytics = pgTable('email_analytics', {
  id: serial('id').primaryKey(),
  date: timestamp('date').notNull(),
  sent: integer('sent').default(0),
  failed: integer('failed').default(0),
  deliveryIssues: text('delivery_issues'),
});

// Activity logs table
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(),
  userEmail: text('user_email'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Excel archives table
export const excelArchives = pgTable('excel_archives', {
  id: serial('id').primaryKey(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(),
  uploadDate: timestamp('upload_date').defaultNow().notNull(),
  data: text('data').notNull(), // Base64 or URL
  metadata: jsonb('metadata'),
});

// Returned parts table
export const returnedParts = pgTable('returned_parts', {
  id: serial('id').primaryKey(),
  partName: text('part_name').notNull(),
  partNumber: text('part_number').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  orderNumber: text('order_number').notNull(),
  returnReason: text('return_reason'),
  trackingNumber: text('tracking_number'),
  shippedDate: timestamp('shipped_date'),
  expectedArrival: timestamp('expected_arrival'),
  arrivedDate: timestamp('arrived_date'),
  inspectionDate: timestamp('inspection_date'),
  status: text('status').default('shipped'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  dropOffTime: timestamp('drop_off_time'),
  deliveryLocation: text('delivery_location'),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  priority: text('priority').notNull().default('medium'),
  partId: text('part_id'),
  data: jsonb('data'),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -------------------- RELATIONS DEFINITION --------------------

// Orders relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  shippingAddress: one(shippingAddresses, {
    fields: [orders.id],
    references: [shippingAddresses.orderId],
  }),
  tracking: many(trackingInfo),
}));

// Shipping addresses relations
export const shippingAddressesRelations = relations(shippingAddresses, ({ one }) => ({
  order: one(orders, {
    fields: [shippingAddresses.orderId],
    references: [orders.id],
  }),
}));

// Tracking info relations
export const trackingInfoRelations = relations(trackingInfo, ({ one }) => ({
  order: one(orders, {
    fields: [trackingInfo.orderId],
    references: [orders.id],
  }),
}));

// -------------------- TYPE DEFINITIONS --------------------

export type Customer = InferSelectModel<typeof customers>;
export type NewCustomer = InferInsertModel<typeof customers>;

export type EmailTemplate = InferSelectModel<typeof emailTemplates>;
export type NewEmailTemplate = InferInsertModel<typeof emailTemplates>;

export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;

export type ShippingAddress = InferSelectModel<typeof shippingAddresses>;
export type NewShippingAddress = InferInsertModel<typeof shippingAddresses>;

export type TrackingInfo = InferSelectModel<typeof trackingInfo>;
export type NewTrackingInfo = InferInsertModel<typeof trackingInfo>;

export type EmailAnalytic = InferSelectModel<typeof emailAnalytics>;
export type NewEmailAnalytic = InferInsertModel<typeof emailAnalytics>;

export type ActivityLog = InferSelectModel<typeof activityLogs>;
export type NewActivityLog = InferInsertModel<typeof activityLogs>;

export type ExcelArchive = InferSelectModel<typeof excelArchives>;
export type NewExcelArchive = InferInsertModel<typeof excelArchives>;

export type ReturnedPart = InferSelectModel<typeof returnedParts>;
export type NewReturnedPart = InferInsertModel<typeof returnedParts>;

export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;

// Legacy types for backward compatibility
export interface Archive {
  id: string;
  fileName: string;
  uploadDate: Date;
  fileSize: number;
  contentType: string;
  supabasePath?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
}

export type NewArchive = Omit<Archive, 'id' | 'createdAt'>;
