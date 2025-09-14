/**
 * Formatting utilities for common data transformations
 */

/**
 * Format currency values with proper symbols and decimal places
 * @param amount - Numeric amount to format
 * @param currency - Currency code (USD, EUR, GBP, etc.)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for invalid currency or locale
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format dates in various formats
 * @param date - Date to format
 * @param format - Format type or custom format string
 * @param locale - Locale for formatting
 * @returns Formatted date string
 */
export type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'iso' | 'relative';

export function formatDate(
  date: Date | string,
  format: DateFormat = 'medium',
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString(locale, {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      });
    case 'medium':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    case 'long':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'full':
      return dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'iso':
      return dateObj.toISOString();
    case 'relative':
      return formatRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString(locale);
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to format relative to now
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  if (Math.abs(diffSec) < 60) {
    return diffSec === 0 ? 'just now' : diffSec > 0 ? `in ${diffSec} seconds` : `${Math.abs(diffSec)} seconds ago`;
  } else if (Math.abs(diffMin) < 60) {
    return diffMin > 0 ? `in ${diffMin} minute${diffMin !== 1 ? 's' : ''}` : `${Math.abs(diffMin)} minute${Math.abs(diffMin) !== 1 ? 's' : ''} ago`;
  } else if (Math.abs(diffHour) < 24) {
    return diffHour > 0 ? `in ${diffHour} hour${diffHour !== 1 ? 's' : ''}` : `${Math.abs(diffHour)} hour${Math.abs(diffHour) !== 1 ? 's' : ''} ago`;
  } else if (Math.abs(diffDay) < 7) {
    return diffDay > 0 ? `in ${diffDay} day${diffDay !== 1 ? 's' : ''}` : `${Math.abs(diffDay)} day${Math.abs(diffDay) !== 1 ? 's' : ''} ago`;
  } else if (Math.abs(diffWeek) < 4) {
    return diffWeek > 0 ? `in ${diffWeek} week${diffWeek !== 1 ? 's' : ''}` : `${Math.abs(diffWeek)} week${Math.abs(diffWeek) !== 1 ? 's' : ''} ago`;
  } else if (Math.abs(diffMonth) < 12) {
    return diffMonth > 0 ? `in ${diffMonth} month${diffMonth !== 1 ? 's' : ''}` : `${Math.abs(diffMonth)} month${Math.abs(diffMonth) !== 1 ? 's' : ''} ago`;
  } else {
    return diffYear > 0 ? `in ${diffYear} year${diffYear !== 1 ? 's' : ''}` : `${Math.abs(diffYear)} year${Math.abs(diffYear) !== 1 ? 's' : ''} ago`;
  }
}

/**
 * Format numbers with thousands separators
 * @param num - Number to format
 * @param decimals - Number of decimal places
 * @param locale - Locale for formatting
 * @returns Formatted number string
 */
export function formatNumber(
  num: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format file sizes in human-readable format
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format percentages
 * @param value - Value to format as percentage (0-1 or 0-100)
 * @param decimals - Number of decimal places
 * @param isDecimal - Whether the input is decimal (0-1) or percentage (0-100)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  isDecimal: boolean = true
): string {
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format phone numbers
 * @param phone - Phone number to format
 * @param format - Format type (US, INTL, E164)
 * @returns Formatted phone number
 */
export type PhoneFormat = 'US' | 'INTL' | 'E164';

export function formatPhoneNumber(phone: string, format: PhoneFormat = 'US'): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  switch (format) {
    case 'US':
      // Format as (XXX) XXX-XXXX
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
      break;
    case 'E164':
      // Format as +XXXXXXXXXXX
      if (cleaned.length >= 10) {
        return `+${cleaned}`;
      }
      break;
    case 'INTL':
      // Format with spaces every 3-4 digits
      if (cleaned.length >= 10) {
        const parts = [];
        let remaining = cleaned;
        if (remaining[0] === '1' && remaining.length === 11) {
          parts.push('+1');
          remaining = remaining.slice(1);
        }
        while (remaining.length > 0) {
          parts.push(remaining.slice(0, 3));
          remaining = remaining.slice(3);
        }
        return parts.join(' ');
      }
      break;
  }

  return phone; // Return original if formatting fails
}