import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value : T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
  const [intValue, floatValue] = num.toString().split('.');
  return floatValue ? `${intValue}.${floatValue.padEnd(2, '0')}` : `${intValue}.00`;
}
