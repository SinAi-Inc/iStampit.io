/**
 * Utility for combining CSS classes
 * Simplified version without external dependencies
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}
