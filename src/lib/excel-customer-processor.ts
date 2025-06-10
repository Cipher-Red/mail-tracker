'use client';

import * as XLSX from 'xlsx';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import type { Customer } from '@/components/customer-management';

// Generate a unique ID for new customers
function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export interface CustomerExcelData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  tags?: string;
  notes?: string;
}

/**
 * Process Excel file and extract customer data
 */
export async function processCustomerExcel(file: File): Promise<{
  customers: Customer[];
  stats: {
    total: number;
    imported: number;
    updated: number;
    invalid: number;
  };
}> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (!result) {
            reject(new Error('Failed to read file content'));
            return;
          }

          // Parse the Excel file
          const workbook = XLSX.read(result, { type: 'binary' });
          
          // Get first worksheet
          const wsname = workbook.SheetNames[0];
          if (!wsname) {
            reject(new Error('No worksheets found in file'));
            return;
          }
          
          const ws = workbook.Sheets[wsname];
          
          // Convert to JSON
          const rawData = XLSX.utils.sheet_to_json<CustomerExcelData>(ws);
          
          if (rawData.length === 0) {
            reject(new Error('No data found in file'));
            return;
          }

          // Get existing customers for update/merge
          const existingCustomers = getLocalStorage<Customer[]>('emailCustomers', []);
          const existingEmails = new Set(existingCustomers.map(c => c.email.toLowerCase()));
          
          const stats = {
            total: rawData.length,
            imported: 0,
            updated: 0,
            invalid: 0
          };

          // Process and convert data to our Customer format
          const processedCustomers: Customer[] = [];
          
          rawData.forEach(row => {
            // Validate required fields
            if (!row.name || !row.email) {
              stats.invalid++;
              return;
            }
            
            const email = row.email.trim().toLowerCase();
            
            // Process tags if provided
            let tags: string[] = [];
            if (row.tags) {
              // Split by commas or semicolons
              tags = row.tags.split(/[,;]/).map(tag => tag.trim()).filter(Boolean);
            }
            
            // Format address from components if present
            let address = row.address || '';
            if (row.city || row.state || row.postalCode) {
              const addressParts = [];
              if (address) addressParts.push(address);
              
              const cityState = [];
              if (row.city) cityState.push(row.city);
              if (row.state) cityState.push(row.state);
              if (cityState.length > 0) addressParts.push(cityState.join(', '));
              
              if (row.postalCode) addressParts.push(row.postalCode);
              
              address = addressParts.join(', ');
            }
            
            const newCustomer: Customer = {
              id: generateId(),
              name: row.name.trim(),
              email: email,
              company: row.company?.trim() || '',
              phone: row.phone?.trim() || '',
              address: address,
              tags: tags,
              addedAt: new Date(),
              lastContact: null,
              notes: row.notes?.trim() || ''
            };
            
            // Check if customer already exists (by email)
            if (existingEmails.has(email)) {
              // Update existing customer
              stats.updated++;
              
              // Find the customer to update
              const existingCustomer = existingCustomers.find(c => 
                c.email.toLowerCase() === email
              );
              
              if (existingCustomer) {
                // Keep the original ID and addedAt date
                newCustomer.id = existingCustomer.id;
                newCustomer.addedAt = existingCustomer.addedAt;
                
                // If the existing customer has lastContact, keep it
                if (existingCustomer.lastContact) {
                  newCustomer.lastContact = existingCustomer.lastContact;
                }
              }
            } else {
              // New customer
              stats.imported++;
            }
            
            processedCustomers.push(newCustomer);
          });
          
          // Merge with existing customers - replace existing ones with updated data
          const mergedCustomers = existingCustomers.filter(existing => 
            !processedCustomers.some(processed => processed.email.toLowerCase() === existing.email.toLowerCase())
          ).concat(processedCustomers);
          
          resolve({
            customers: processedCustomers,
            stats
          });
        } catch (error) {
          console.error('Error processing Excel file:', error);
          reject(error instanceof Error ? error : new Error('Unknown error processing file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      // Read the file as binary
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error in processCustomerExcel:', error);
      reject(error);
    }
  });
}
