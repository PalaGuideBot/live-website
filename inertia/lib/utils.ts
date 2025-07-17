import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number, options?: Intl.NumberFormatOptions) {
  options = {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
    ...options,
  }
  return new Intl.NumberFormat('fr-FR', options).format(value)
}
