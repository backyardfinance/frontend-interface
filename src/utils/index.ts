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

export function formatNumber(number: number): string {
  return number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const shortFormIntegerFormatter = Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  notation: "compact",
});

export const formatUsdAmount = (value: number): string => {
  try {
    let maximumFractionDigits = 2;
    if (value < 1) maximumFractionDigits = 7;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits,
      notation: "compact",
    }).format(value);
  } catch {
    return "";
  }
};
