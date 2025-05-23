/**
 * Utility functions for cleaning and validating order data
 */

// Raw data type interface
interface RawOrderData {
  [key: string]: any;
}

// Cleaned data interface
export interface CleanedOrderData {
  customerOrderNumber: string;
  shipToName: string;
  shipToPhone: string;
  shipToLine1: string;
  shipToCity: string;
  shipToStateProvince: string;
  shipToPostalCode: string;
  orderTotal: number;
  actualShipDate: string;
  trackingNumbers: string[];
  orderSource: string;
  orderSummary: string;
}

// Stats about the processed data
interface ProcessingStats {
  total: number;
  processed: number;
  filtered: number;
  invalid: number;
}

/**
 * Clean and validate order data according to the specified rules
 */
export function cleanAndValidateData(rawData: RawOrderData[]): {
  cleanedData: CleanedOrderData[];
  stats: ProcessingStats;
} {
  const stats: ProcessingStats = {
    total: rawData.length,
    processed: 0,
    filtered: 0,
    invalid: 0
  };
  
  const cleanedData: CleanedOrderData[] = [];
  
  // Process each row
  for (const row of rawData) {
    // Skip if order status is not "New" or shipping status is not "Shipped"
    const orderStatus = getFieldValue(row, 'Order Status', 'orderStatus');
    const shippingStatus = getFieldValue(row, 'Shipping Status', 'shippingStatus');
    
    if (
      (orderStatus && orderStatus.toString().trim().toLowerCase() !== 'new') || 
      (shippingStatus && shippingStatus.toString().trim().toLowerCase() !== 'shipped')
    ) {
      stats.filtered++;
      continue;
    }
    
    // Get required fields
    const customerOrderNumber = getFieldValue(row, 'Customer Order Number', 'customerOrderNumber');
    const shipToName = getFieldValue(row, 'Ship To Name', 'shipToName');
    const shipToLine1 = getFieldValue(row, 'Ship To Line1', 'shipToLine1', 'shipToAddress', 'address');
    const shipToStateProvince = getFieldValue(row, 'Ship To State Province', 'shipToState', 'state');
    
    // Skip if any required fields are missing
    if (!customerOrderNumber || !shipToName || !shipToLine1 || !shipToStateProvince) {
      stats.invalid++;
      continue;
    }
    
    // Get other fields with fallbacks
    const shipToPhone = formatPhoneNumber(getFieldValue(row, 'Ship To Phone', 'shipToPhone', 'phone'));
    const shipToCity = getFieldValue(row, 'Ship To City', 'shipToCity', 'city') || '';
    const shipToPostalCode = getFieldValue(row, 'Ship To Postal Code', 'shipToPostalCode', 'zipCode', 'postalCode') || '';
    const orderTotal = parseOrderTotal(getFieldValue(row, 'Order Total', 'orderTotal', 'total'));
    const actualShipDate = formatDate(getFieldValue(row, 'Actual Ship Date', 'actualShipDate', 'shipDate'));
    const trackingLinks = getFieldValue(row, 'Tracking Link(s)', 'trackingLinks', 'trackingNumbers');
    const orderSource = getFieldValue(row, 'Order Source', 'orderSource', 'source') || '';
    const orderSummary = getFieldValue(row, 'Order Summary', 'orderSummary', 'summary') || '';
    
    // Extract tracking numbers from tracking links
    const trackingNumbers = extractTrackingNumbers(
      typeof trackingLinks === 'number' ? trackingLinks.toString() : trackingLinks
    );
    
    // Add cleaned item to the results
    cleanedData.push({
      customerOrderNumber: customerOrderNumber.toString().trim(),
      shipToName: shipToName.toString().trim(),
      shipToPhone,
      shipToLine1: shipToLine1.toString().trim(),
      shipToCity: shipToCity.toString().trim(),
      shipToStateProvince: shipToStateProvince.toString().trim(),
      shipToPostalCode: shipToPostalCode.toString().trim(),
      orderTotal,
      actualShipDate,
      trackingNumbers,
      orderSource: orderSource.toString().trim(),
      orderSummary: orderSummary.toString().trim()
    });
    
    stats.processed++;
  }
  
  return { cleanedData, stats };
}

/**
 * Helper function to get a field value from an object with various possible key names
 */
function getFieldValue(obj: RawOrderData, ...possibleKeys: string[]): string | number | undefined {
  for (const key of possibleKeys) {
    // Check for exact key match
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
    
    // Case-insensitive search
    const lcKey = key.toLowerCase();
    const matchingKey = Object.keys(obj).find(k => k.toLowerCase() === lcKey);
    if (matchingKey && obj[matchingKey] !== undefined && obj[matchingKey] !== null) {
      return obj[matchingKey];
    }
  }
  
  return undefined;
}

/**
 * Format a phone number to contain only digits
 */
function formatPhoneNumber(phone: string | number | undefined): string {
  if (!phone) return '';
  
  const phoneStr = phone.toString();
  // Extract only digits
  const digits = phoneStr.replace(/\D/g, '');
  
  // Check if it's a valid North American number
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return as is if not a standard format
  return digits;
}

/**
 * Parse an order total to a number with 2 decimal places
 */
function parseOrderTotal(total: string | number | undefined): number {
  if (total === undefined || total === null) return 0;
  
  if (typeof total === 'number') {
    return parseFloat(total.toFixed(2));
  }
  
  // Extract numbers and decimal points from string
  const numStr = total.toString().replace(/[^\d.-]/g, '');
  
  try {
    const parsed = parseFloat(numStr);
    return isNaN(parsed) ? 0 : parseFloat(parsed.toFixed(2));
  } catch {
    return 0;
  }
}

/**
 * Format a date to ISO 8601 (YYYY-MM-DD)
 */
function formatDate(dateStr: string | number | undefined): string {
  if (!dateStr) return new Date().toISOString().split('T')[0]; // Default to today
  
  let date: Date;
  
  if (typeof dateStr === 'number') {
    // Handle Excel serial date numbers
    if (dateStr < 60000) { // Likely an Excel date (days since 1900-01-01)
      // Excel's epoch starts at 1900-01-01, but Excel incorrectly assumes 1900 is a leap year
      // So we adjust by adding the days from 1900-01-01 to 1970-01-01 (25569 days)
      // and then subtract 1 for the leap year bug
      const excelEpochToJsEpoch = (dateStr - 25569) * 86400 * 1000;
      date = new Date(excelEpochToJsEpoch);
    } else {
      // Unix timestamp (milliseconds)
      date = new Date(dateStr);
    }
  } else {
    // Try parsing the string date
    const parsed = Date.parse(dateStr.toString());
    if (isNaN(parsed)) {
      // Handle various date formats
      const parts = dateStr.toString().split(/[-/]/);
      if (parts.length >= 3) {
        // Try different date formats: MM/DD/YYYY, DD/MM/YYYY, YYYY/MM/DD
        const possibleFormats = [
          new Date(`${parts[2]}-${parts[0]}-${parts[1]}`), // MM/DD/YYYY
          new Date(`${parts[2]}-${parts[1]}-${parts[0]}`), // DD/MM/YYYY
          new Date(`${parts[0]}-${parts[1]}-${parts[2]}`)  // YYYY/MM/DD
        ];
        
        // Find the first valid date
        const validDate = possibleFormats.find(d => !isNaN(d.getTime()));
        date = validDate ?? new Date();
      } else {
        date = new Date();
      }
    } else {
      date = new Date(parsed);
    }
  }
  
  // Format to YYYY-MM-DD
  return date.toISOString().split('T')[0];
}

/**
 * Extract tracking numbers from tracking links or text
 */
function extractTrackingNumbers(trackingInfo: string | string[] | undefined): string[] {
  if (!trackingInfo) return [];
  
  // If already an array, flatten it
  if (Array.isArray(trackingInfo)) {
    return trackingInfo.flatMap(info => extractTrackingNumbers(info));
  }
  
  const trackingStr = trackingInfo.toString();
  
  // Common tracking number patterns
  const patterns = [
    /\b(1Z[0-9A-Z]{16})\b/g, // UPS
    /\b(T\d{10})\b/g, // Fedex Express (older)
    /\b(\d{12,14})\b/g, // Fedex, USPS, others
    /\b([A-Z]{2}\d{9}[A-Z]{2})\b/g, // USPS international
    /\b(\d{20,22})\b/g, // DHL, others
    /tracking[=#/:]([^&\s]+)/gi, // From URLs
  ];
  
  // Extract tracking numbers using the patterns
  const trackingNumbers = new Set<string>();
  
  // Try to extract using patterns
  for (const pattern of patterns) {
    const matches = trackingStr.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) trackingNumbers.add(match[1]);
    }
  }
  
  // If no matches found and the input has fewer than 30 characters, 
  // it might be a tracking number itself
  if (trackingNumbers.size === 0 && trackingStr.length < 30 && trackingStr.length > 8) {
    // Remove common URL components
    const cleaned = trackingStr
      .replace(/https?:\/\//g, '')
      .replace(/www\./g, '')
      .trim();
    
    if (cleaned.length > 8) {
      trackingNumbers.add(cleaned);
    }
  }
  
  return Array.from(trackingNumbers);
}
