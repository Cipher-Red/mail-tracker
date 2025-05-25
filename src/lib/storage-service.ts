'use client';

import { Order, Customer, EmailTemplate, TrackingInfo, ShippingAddress, EmailAnalytic } from "@/db/schema";

// Storage keys
const STORAGE_KEYS = {
  ORDERS: 'app_orders',
  CUSTOMERS: 'app_customers',
  EMAIL_TEMPLATES: 'app_email_templates',
  EMAIL_ANALYTICS: 'app_email_analytics',
  CURRENT_PAGE: 'app_current_page',
  PAGINATION_STATE: 'app_pagination_state',
};

// Generic function to save data to localStorage
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    // We've already checked window exists, use localStorage via window
    const storage = window.localStorage;
    storage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage (${key}):`, error);
    // Handle quota exceeded or other storage errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Try exporting and clearing some data.');
    }
  }
}

// Generic function to get data from localStorage
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    // We've already checked window exists, use localStorage via window
    const storage = window.localStorage;
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting data from localStorage (${key}):`, error);
    return defaultValue;
  }
}

// Generate a unique ID for new items
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// Order storage operations
export const orderStorage = {
  getAll: (): Order[] => getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []),
  
  getById: (id: number): Order | undefined => {
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    return orders.find(order => order.id === id);
  },
  
  save: (orders: Order[]): void => {
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  },
  
  add: (order: Omit<Order, 'id'>): Order => {
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    const newOrder = { ...order, id: generateId() };
    orders.push(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },
  
  update: (id: number, data: Partial<Order>): Order | undefined => {
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex(order => order.id === id);
    if (index === -1) return undefined;
    
    orders[index] = { ...orders[index], ...data, updatedAt: new Date() };
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },
  
  delete: (id: number): boolean => {
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    const filtered = orders.filter(order => order.id !== id);
    if (filtered.length === orders.length) return false;
    saveToStorage(STORAGE_KEYS.ORDERS, filtered);
    return true;
  },
  
  // New method to clear all orders
  clear: (): void => {
    saveToStorage(STORAGE_KEYS.ORDERS, []);
  }
};

// Related order data storage (tracking, shipping address)
export const trackingStorage = {
  getByOrderId: (orderId: number): TrackingInfo[] => {
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    const order = orders.find(order => order.id === orderId);
    return order?.tracking || [];
  },
  
  saveForOrder: (orderId: number, trackingData: TrackingInfo[]): boolean => {
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex(order => order.id === orderId);
    if (index === -1) return false;
    
    orders[index].tracking = trackingData.map(t => ({
      ...t,
      id: t.id || generateId(),
      orderId
    }));
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return true;
  }
};

export const shippingAddressStorage = {
  getByOrderId: (orderId: number): ShippingAddress | undefined => {
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    const order = orders.find(order => order.id === orderId);
    return order?.shippingAddress;
  },
  
  saveForOrder: (orderId: number, addressData: ShippingAddress): boolean => {
    const orders = getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
    const index = orders.findIndex(order => order.id === orderId);
    if (index === -1) return false;
    
    orders[index].shippingAddress = {
      ...addressData,
      id: addressData.id || generateId(),
      orderId
    };
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return true;
  }
};

// Customer storage operations
export const customerStorage = {
  getAll: (): Customer[] => getFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []),
  
  getById: (id: number): Customer | undefined => {
    const customers = getFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    return customers.find(customer => customer.id === id);
  },
  
  save: (customers: Customer[]): void => {
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
  },
  
  add: (customer: Omit<Customer, 'id'>): Customer => {
    const customers = getFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const newCustomer = { ...customer, id: generateId() };
    customers.push(newCustomer);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    return newCustomer;
  },
  
  update: (id: number, data: Partial<Customer>): Customer | undefined => {
    const customers = getFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const index = customers.findIndex(customer => customer.id === id);
    if (index === -1) return undefined;
    
    customers[index] = { ...customers[index], ...data };
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    return customers[index];
  },
  
  delete: (id: number): boolean => {
    const customers = getFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const filtered = customers.filter(customer => customer.id !== id);
    if (filtered.length === customers.length) return false;
    saveToStorage(STORAGE_KEYS.CUSTOMERS, filtered);
    return true;
  }
};

// Email template storage operations
export const templateStorage = {
  getAll: (): EmailTemplate[] => getFromStorage<EmailTemplate[]>(STORAGE_KEYS.EMAIL_TEMPLATES, []),
  
  getById: (id: number): EmailTemplate | undefined => {
    const templates = getFromStorage<EmailTemplate[]>(STORAGE_KEYS.EMAIL_TEMPLATES, []);
    return templates.find(template => template.id === id);
  },
  
  save: (templates: EmailTemplate[]): void => {
    saveToStorage(STORAGE_KEYS.EMAIL_TEMPLATES, templates);
  },
  
  add: (template: Omit<EmailTemplate, 'id'>): EmailTemplate => {
    const templates = getFromStorage<EmailTemplate[]>(STORAGE_KEYS.EMAIL_TEMPLATES, []);
    const newTemplate = { 
      ...template, 
      id: generateId(), 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    templates.push(newTemplate);
    saveToStorage(STORAGE_KEYS.EMAIL_TEMPLATES, templates);
    return newTemplate;
  },
  
  update: (id: number, data: Partial<EmailTemplate>): EmailTemplate | undefined => {
    const templates = getFromStorage<EmailTemplate[]>(STORAGE_KEYS.EMAIL_TEMPLATES, []);
    const index = templates.findIndex(template => template.id === id);
    if (index === -1) return undefined;
    
    templates[index] = { 
      ...templates[index], 
      ...data, 
      updatedAt: new Date() 
    };
    saveToStorage(STORAGE_KEYS.EMAIL_TEMPLATES, templates);
    return templates[index];
  },
  
  delete: (id: number): boolean => {
    const templates = getFromStorage<EmailTemplate[]>(STORAGE_KEYS.EMAIL_TEMPLATES, []);
    const filtered = templates.filter(template => template.id !== id);
    if (filtered.length === templates.length) return false;
    saveToStorage(STORAGE_KEYS.EMAIL_TEMPLATES, filtered);
    return true;
  }
};

// Analytics storage operations
export const analyticsStorage = {
  getAll: (): EmailAnalytic[] => getFromStorage<EmailAnalytic[]>(STORAGE_KEYS.EMAIL_ANALYTICS, []),
  
  save: (analytics: EmailAnalytic[]): void => {
    saveToStorage(STORAGE_KEYS.EMAIL_ANALYTICS, analytics);
  },
  
  add: (analytic: EmailAnalytic): void => {
    const analytics = getFromStorage<EmailAnalytic[]>(STORAGE_KEYS.EMAIL_ANALYTICS, []);
    analytics.push({ ...analytic, id: analytic.id || generateId() });
    saveToStorage(STORAGE_KEYS.EMAIL_ANALYTICS, analytics);
  },
  
  updateForDate: (date: string, data: Partial<EmailAnalytic>): EmailAnalytic | undefined => {
    const analytics = getFromStorage<EmailAnalytic[]>(STORAGE_KEYS.EMAIL_ANALYTICS, []);
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const index = analytics.findIndex(a => 
      new Date(a.date).toISOString().split('T')[0] === formattedDate
    );
    
    if (index === -1) {
      const newAnalytic = {
        id: generateId(),
        date: new Date(date),
        sent: data.sent || 0,
        failed: data.failed || 0,
        deliveryIssues: data.deliveryIssues || null
      };
      analytics.push(newAnalytic);
      saveToStorage(STORAGE_KEYS.EMAIL_ANALYTICS, analytics);
      return newAnalytic;
    } else {
      analytics[index] = { 
        ...analytics[index], 
        ...data 
      };
      saveToStorage(STORAGE_KEYS.EMAIL_ANALYTICS, analytics);
      return analytics[index];
    }
  }
};

// Pagination state storage
export const paginationStorage = {
  getCurrentPage: (): number => getFromStorage(STORAGE_KEYS.CURRENT_PAGE, 0),
  
  setCurrentPage: (page: number): void => {
    saveToStorage(STORAGE_KEYS.CURRENT_PAGE, page);
  },
  
  getPaginationState: (key: string, defaultValue: any = {}): any => {
    const state = getFromStorage(STORAGE_KEYS.PAGINATION_STATE, {});
    return state[key] || defaultValue;
  },
  
  setPaginationState: (key: string, value: any): void => {
    const state = getFromStorage(STORAGE_KEYS.PAGINATION_STATE, {});
    state[key] = value;
    saveToStorage(STORAGE_KEYS.PAGINATION_STATE, state);
  }
};
