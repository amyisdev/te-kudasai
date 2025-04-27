import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ObjectKeys<T extends object> = `${Exclude<keyof T, symbol>}`
export const objectKeys = Object.keys as <Type extends object>(value: Type) => Array<ObjectKeys<Type>>
