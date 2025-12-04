import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateBookingNumber(bookingId: string, bookingType: string): string {
  const prefix = bookingType === 'hotel' ? 'HTL' : bookingType === 'package' ? 'PKG' : 'CUS';
  const timestamp = Date.now().toString().slice(-6);
  const shortId = bookingId.slice(-4).toUpperCase();
  return `${prefix}-${timestamp}-${shortId}`;
}
