'use client';

import { pgTable, text, timestamp, integer, serial, jsonb, boolean } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Define order entity types
export interface Order {
  id: number;
  customerOrderNumber: string;
  customerId?: number | null;
  orderTotal: number;
  orderDate: Date;
  actualShipDate: Date | null;
  orderStatus: string;
  orderSource: string | null;
  orderSummary: string | null;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress?: ShippingAddress;
  tracking: TrackingInfo[];
  items: OrderItem[];
}

export interface ShippingAddress {
  id: number;
  orderId: number;
  shipToName: string;
  shipToPhone: string | null;
  shipToEmail: string | null;
  shipToLine1: string;
  shipToCity: string;
  shipToStateProvince: string;
  shipToPostalCode: string;
  shipToCountry: string;
}

export interface TrackingInfo {
  id: number;
  orderId: number;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
  lastUpdated: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  sku: string | null;
  productDescription: string | null;
}

// Define customer entity type
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  tags?: string[];
  addedAt: Date;
  lastContact?: Date | null;
  notes?: string | null;
}

// Define email template entity type
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  preheader: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define email analytics entity type
export interface EmailAnalytic {
  id: number;
  date: Date;
  sent: number;
  failed: number;
  deliveryIssues: string | null;
}

// Define excel archive entity type
export interface ExcelArchive {
  id: string;
  fileName: string;
  uploadDate: Date;
  fileSize: number;
  contentType: string;
  supabasePath?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
}

// Define the archives table schema for Drizzle
export const archives = pgTable('archives', {
  id: text('id').primaryKey(),
  fileName: text('file_name').notNull(),
  uploadDate: timestamp('upload_date').notNull(),
  fileSize: integer('file_size').notNull(),
  contentType: text('content_type').notNull(),
  supabasePath: text('supabase_path'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Returned Parts table for real-time notifications
export const returnedParts = pgTable('returned_parts', {
  id: serial('id').primaryKey(),
  partName: text('part_name').notNull(),
  partNumber: text('part_number').notNull(),
  customerName: text('customer_name').notNull(),
  orderNumber: text('order_number').notNull(),
  returnReason: text('return_reason'),
  trackingNumber: text('tracking_number'),
  shippedDate: text('shipped_date'),
  expectedArrival: text('expected_arrival'),
  arrivedDate: text('arrived_date'),
  inspectionDate: text('inspection_date'),
  status: text('status').notNull().default('shipped'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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

// Define types for CRUD operations
export type Archive = InferSelectModel<typeof archives>;
export type NewArchive = InferInsertModel<typeof archives>;
export type ReturnedPart = InferSelectModel<typeof returnedParts>;
export type NewReturnedPart = InferInsertModel<typeof returnedParts>;
export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;
