// Define the types for localStorage storage
// We're maintaining similar structure to the original schema

// Email Templates type
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  preheader?: string | null;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Customer type
export interface Customer {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  tags?: string[] | null;
  addedAt: Date | string;
  lastContact?: Date | string | null;
  notes?: string | null;
  metadata?: Record<string, any> | null;
}

// Sent Email type
export interface SentEmail {
  id: number;
  customerId?: number | null;
  templateId?: number | null;
  subject: string;
  content: string;
  sentAt: Date | string;
  status: string; // 'sent', 'failed', 'pending'
  errorMessage?: string | null;
}

// Order type
export interface Order {
  id: number;
  customerOrderNumber: string;
  customerId?: number | null;
  orderTotal: number;
  orderDate: Date | string;
  actualShipDate?: Date | string | null;
  orderStatus: string; // 'new', 'processing', 'shipped', 'delivered', 'cancelled'
  orderSource?: string | null;
  orderSummary?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Related data embedded directly (for localStorage)
  shippingAddress?: ShippingAddress;
  tracking?: TrackingInfo[];
  customer?: Customer;
  items?: OrderItem[];
}

// Shipping Address type
export interface ShippingAddress {
  id: number;
  orderId: number;
  shipToName: string;
  shipToPhone?: string | null;
  shipToEmail?: string | null;
  shipToLine1: string;
  shipToLine2?: string | null;
  shipToCity: string;
  shipToStateProvince: string;
  shipToPostalCode: string;
  shipToCountry?: string;
  // Extra fields to handle various Excel import formats
  additionalData?: Record<string, any> | null;
}

// Tracking Information type
export interface TrackingInfo {
  id: number;
  orderId: number;
  trackingNumber: string;
  carrier?: string;
  trackingUrl?: string | null;
  status?: string | null; // 'in_transit', 'delivered', 'exception'
  lastUpdated: Date | string;
}

// Order Item type
export interface OrderItem {
  id: number;
  orderId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  sku?: string | null;
  productDescription?: string | null;
}

// Email Analytics type
export interface EmailAnalytic {
  id: number;
  date: Date | string;
  sent: number;
  failed: number;
  deliveryIssues?: string | null;
}

// For pagination
export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  sortField?: string;
  sortDirection?: string;
}

// NewX types (for creating new records)
export type NewEmailTemplate = Omit<EmailTemplate, 'id'>;
export type NewCustomer = Omit<Customer, 'id'>;
export type NewSentEmail = Omit<SentEmail, 'id'>;
export type NewOrder = Omit<Order, 'id'>;
export type NewShippingAddress = Omit<ShippingAddress, 'id'>;
export type NewTrackingInfo = Omit<TrackingInfo, 'id'>;
export type NewOrderItem = Omit<OrderItem, 'id'>;
export type NewEmailAnalytic = Omit<EmailAnalytic, 'id'>;
