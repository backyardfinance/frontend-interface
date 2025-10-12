import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string | undefined): string {
  if (!address) return "";
  if (address.length <= 16) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
