'use client';

import { pgTable } from "drizzle-orm/pg-core";

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
