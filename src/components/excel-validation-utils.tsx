'use client';

export interface ValidationError {
  row: number;
  field: string;
  value: any;
  error: string;
  severity: 'error' | 'warning';
}
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  validRows: any[];
  invalidRows: any[];
}
export interface ReturnedPartValidationRules {
  partName: {
    required: true;
    type: 'string';
    minLength?: number;
    maxLength?: number;
  };
  partNumber: {
    required: true;
    type: 'string';
    pattern?: RegExp;
  };
  customerName: {
    required: true;
    type: 'string';
    minLength?: number;
  };
  orderNumber: {
    required: true;
    type: 'string';
    pattern?: RegExp;
  };
  returnReason: {
    required: false;
    type: 'string';
    allowedValues?: string[];
  };
  trackingNumber: {
    required: false;
    type: 'string';
    pattern?: RegExp;
  };
  shippedDate: {
    required: false;
    type: 'date';
  };
  expectedArrival: {
    required: false;
    type: 'date';
  };
  status: {
    required: false;
    type: 'string';
    allowedValues?: string[];
  };
  notes: {
    required: false;
    type: 'string';
    maxLength?: number;
  };
}
const VALIDATION_RULES: ReturnedPartValidationRules = {
  partName: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100
  },
  partNumber: {
    required: true,
    type: 'string',
    pattern: /^[A-Z0-9\-_]{3,20}$/i
  },
  customerName: {
    required: true,
    type: 'string',
    minLength: 2
  },
  orderNumber: {
    required: true,
    type: 'string',
    pattern: /^[A-Z0-9\-_]{3,30}$/i
  },
  returnReason: {
    required: false,
    type: 'string',
    allowedValues: ['Defective', 'Wrong Part', 'Customer Return', 'Warranty', 'Quality Issue', 'Other']
  },
  trackingNumber: {
    required: false,
    type: 'string',
    pattern: /^[A-Z0-9]{10,30}$/i
  },
  shippedDate: {
    required: false,
    type: 'date'
  },
  expectedArrival: {
    required: false,
    type: 'date'
  },
  status: {
    required: false,
    type: 'string',
    allowedValues: ['shipped', 'in_transit', 'arrived', 'inspecting', 'inspected', 'processed']
  },
  notes: {
    required: false,
    type: 'string',
    maxLength: 500
  }
};
export function validateReturnedPartsData(data: any[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const validRows: any[] = [];
  const invalidRows: any[] = [];
  if (!Array.isArray(data) || data.length === 0) {
    return {
      isValid: false,
      errors: [{
        row: 0,
        field: 'data',
        value: data,
        error: 'No data provided or data is not an array',
        severity: 'error'
      }],
      warnings: [],
      validRows: [],
      invalidRows: []
    };
  }
  data.forEach((row, index) => {
    const rowNumber = index + 1;
    let hasErrors = false;
    const rowErrors: ValidationError[] = [];
    const rowWarnings: ValidationError[] = [];

    // Check if row is completely empty
    const hasAnyData = Object.values(row).some(value => value !== null && value !== undefined && String(value).trim() !== '');
    if (!hasAnyData) {
      rowErrors.push({
        row: rowNumber,
        field: 'row',
        value: row,
        error: 'Row is completely empty',
        severity: 'error'
      });
      hasErrors = true;
    } else {
      // Validate each field according to rules
      Object.entries(VALIDATION_RULES).forEach(([fieldName, rules]) => {
        const value = row[fieldName] || row[fieldName.toLowerCase()] || row[fieldName.toUpperCase()];

        // Check required fields
        if (rules.required && (value === null || value === undefined || String(value).trim() === '')) {
          rowErrors.push({
            row: rowNumber,
            field: fieldName,
            value: value,
            error: `${fieldName} is required but missing`,
            severity: 'error'
          });
          hasErrors = true;
          return;
        }

        // Skip validation for optional empty fields
        if (!rules.required && (value === null || value === undefined || String(value).trim() === '')) {
          return;
        }
        const stringValue = String(value).trim();

        // Type validation
        switch (rules.type) {
          case 'string':
            if (rules.minLength && stringValue.length < rules.minLength) {
              rowErrors.push({
                row: rowNumber,
                field: fieldName,
                value: value,
                error: `${fieldName} must be at least ${rules.minLength} characters long`,
                severity: 'error'
              });
              hasErrors = true;
            }
            if (rules.maxLength && stringValue.length > rules.maxLength) {
              rowErrors.push({
                row: rowNumber,
                field: fieldName,
                value: value,
                error: `${fieldName} must be no more than ${rules.maxLength} characters long`,
                severity: 'error'
              });
              hasErrors = true;
            }
            if (rules.pattern && !rules.pattern.test(stringValue)) {
              rowErrors.push({
                row: rowNumber,
                field: fieldName,
                value: value,
                error: `${fieldName} format is invalid`,
                severity: 'error'
              });
              hasErrors = true;
            }
            if (rules.allowedValues && !rules.allowedValues.includes(stringValue)) {
              rowWarnings.push({
                row: rowNumber,
                field: fieldName,
                value: value,
                error: `${fieldName} value "${stringValue}" is not in the recommended list: ${rules.allowedValues.join(', ')}`,
                severity: 'warning'
              });
            }
            break;
          case 'date':
            const dateValue = parseDate(stringValue);
            if (!dateValue) {
              rowErrors.push({
                row: rowNumber,
                field: fieldName,
                value: value,
                error: `${fieldName} is not a valid date format`,
                severity: 'error'
              });
              hasErrors = true;
            } else {
              // Check for future dates where it doesn't make sense
              if (fieldName === 'shippedDate' && dateValue > new Date()) {
                rowWarnings.push({
                  row: rowNumber,
                  field: fieldName,
                  value: value,
                  error: `${fieldName} is in the future, which may be incorrect`,
                  severity: 'warning'
                });
              }
            }
            break;
        }
      });

      // Cross-field validation
      if (row.shippedDate && row.expectedArrival) {
        const shippedDate = parseDate(String(row.shippedDate));
        const expectedDate = parseDate(String(row.expectedArrival));
        if (shippedDate && expectedDate && expectedDate < shippedDate) {
          rowErrors.push({
            row: rowNumber,
            field: 'expectedArrival',
            value: row.expectedArrival,
            error: 'Expected arrival date cannot be before shipped date',
            severity: 'error'
          });
          hasErrors = true;
        }
      }
    }

    // Collect errors and warnings
    errors.push(...rowErrors);
    warnings.push(...rowWarnings);

    // Categorize rows
    if (hasErrors) {
      invalidRows.push({
        ...row,
        _rowNumber: rowNumber,
        _errors: rowErrors
      });
    } else {
      validRows.push({
        ...row,
        _rowNumber: rowNumber,
        _warnings: rowWarnings
      });
    }
  });
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    validRows,
    invalidRows
  };
}
function parseDate(dateString: string): Date | null {
  if (!dateString || dateString.trim() === '') return null;

  // Try different date formats
  const formats = [
  // ISO format
  /^\d{4}-\d{2}-\d{2}$/,
  // US format
  /^\d{1,2}\/\d{1,2}\/\d{4}$/,
  // European format
  /^\d{1,2}\.\d{1,2}\.\d{4}$/,
  // Excel serial date (number)
  /^\d+$/];
  const trimmed = dateString.trim();

  // Handle Excel serial dates
  if (/^\d+$/.test(trimmed)) {
    const serialDate = parseInt(trimmed);
    if (serialDate > 25569 && serialDate < 100000) {
      // Reasonable range for Excel dates
      const date = new Date((serialDate - 25569) * 86400 * 1000);
      return isNaN(date.getTime()) ? null : date;
    }
  }

  // Try parsing as regular date
  const date = new Date(trimmed);
  return isNaN(date.getTime()) ? null : date;
}
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  const errorsByRow = errors.reduce((acc, error) => {
    if (!acc[error.row]) acc[error.row] = [];
    acc[error.row].push(error);
    return acc;
  }, {} as Record<number, ValidationError[]>);
  return Object.entries(errorsByRow).map(([row, rowErrors]) => {
    const errorMessages = rowErrors.map(e => `  • ${e.field}: ${e.error}`).join('\n');
    return `Row ${row}:\n${errorMessages}`;
  }).join('\n\n');
}
export function getValidationSummary(result: ValidationResult): string {
  const {
    errors,
    warnings,
    validRows,
    invalidRows
  } = result;
  let summary = `Validation Summary:\n`;
  summary += `• Total rows processed: ${validRows.length + invalidRows.length}\n`;
  summary += `• Valid rows: ${validRows.length}\n`;
  summary += `• Invalid rows: ${invalidRows.length}\n`;
  summary += `• Errors: ${errors.length}\n`;
  summary += `• Warnings: ${warnings.length}`;
  return summary;
}