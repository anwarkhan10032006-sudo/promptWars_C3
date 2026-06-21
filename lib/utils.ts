import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to format numbers as carbon metrics (e.g. "1,240 kg CO2e")
export function formatCarbon(kg: number): string {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(kg)} kg CO2e`;
}

// Utility to format currency
export function formatCurrency(usd: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd);
}
