import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and tailwind-merge
 * This utility function helps combine Tailwind CSS classes safely
 * @param inputs - Class names to merge
 * @returns Merged class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date into a localized string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
) {
  return new Date(date).toLocaleDateString(undefined, options)
}

/**
 * Delay execution for specified milliseconds
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Check if running on client side
 */
export const isClient = typeof window !== "undefined"

/**
 * Check if running on server side
 */
export const isServer = typeof window === "undefined"

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait
 */
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<F>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Safe JSON parse with fallback
 * @param value - String to parse
 * @param fallback - Fallback value if parsing fails
 */
export function safeJSONParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

/**
 * Capitalize first letter of string
 * @param str - String to capitalize
 */
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generate random string of specified length
 * @param length - Length of string to generate
 */
export function randomString(length: number): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 */
export function isEmpty(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && value !== null && Object.keys(value).length === 0)
  )
}