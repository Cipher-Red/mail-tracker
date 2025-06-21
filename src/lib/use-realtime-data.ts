'use client';

import { useState, useEffect, useCallback } from 'react';
import { Customer } from '@/db/schema';
import { customerService } from '@/lib/supabase-client';

interface RealtimeHookOptions {
  onInsert?: (record: Customer) => void;
  onUpdate?: (record: Customer, oldRecord?: Customer) => void;
  onDelete?: (record: Customer) => void;
}

interface RealtimeHookReturn {
  data: Customer[];
  isLoading: boolean;
  error: string | null;
  lastSyncTime: Date | null;
  isConnected: boolean;
  refreshData: () => Promise<void>;
  addRecord: (data: Omit<Customer, 'id' | 'addedAt'>) => Promise<Customer>;
  updateRecord: (id: number, data: Partial<Customer>) => Promise<Customer>;
  deleteRecord: (id: number) => Promise<void>;
}

export function useRealtimeCustomers(options: RealtimeHookOptions = {}): RealtimeHookReturn {
  const [data, setData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const customers = await customerService.getAll();
      setData(customers);
      setLastSyncTime(new Date());
      setIsConnected(true);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRecord = useCallback(async (customerData: Omit<Customer, 'id' | 'addedAt'>) => {
    try {
      const newCustomer = await customerService.create({
        ...customerData,
        addedAt: new Date()
      });
      setData(prev => [newCustomer, ...prev]);
      if (options.onInsert) {
        options.onInsert(newCustomer);
      }
      return newCustomer;
    } catch (err) {
      console.error('Error adding customer:', err);
      throw err;
    }
  }, [options]);

  const updateRecord = useCallback(async (id: number, customerData: Partial<Customer>) => {
    try {
      const updatedCustomer = await customerService.update(id, customerData);
      setData(prev => prev.map(customer => 
        customer.id === id ? updatedCustomer : customer
      ));
      if (options.onUpdate) {
        const oldRecord = data.find(c => c.id === id);
        options.onUpdate(updatedCustomer, oldRecord);
      }
      return updatedCustomer;
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  }, [options, data]);

  const deleteRecord = useCallback(async (id: number) => {
    try {
      const customerToDelete = data.find(c => c.id === id);
      await customerService.delete(id);
      setData(prev => prev.filter(customer => customer.id !== id));
      if (options.onDelete && customerToDelete) {
        options.onDelete(customerToDelete);
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  }, [options, data]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    data,
    isLoading,
    error,
    lastSyncTime,
    isConnected,
    refreshData,
    addRecord,
    updateRecord,
    deleteRecord,
  };
}
