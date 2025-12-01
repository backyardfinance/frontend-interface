import Big from "big.js";
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

//not used
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

export function formatMonetaryAmount(value: number | string): string {
  try {
    const bigNumber = Big(value);
    if (bigNumber.lt(1_000)) {
      return value.toString();
    }

    const suffixes = [
      { value: 1_000_000_000_000, symbol: "T" },
      { value: 1_000_000_000, symbol: "B" },
      { value: 1_000_000, symbol: "M" },
      { value: 1_000, symbol: "k" },
    ];

    for (const suffix of suffixes) {
      if (bigNumber.gte(suffix.value)) {
        const abbreviated = bigNumber.div(suffix.value).toFixed(1);
        return `${parseFloat(abbreviated)}${suffix.symbol}`;
      }
    }
  } catch (e) {
    console.error(e);
    return "0";
  }
  return "0";
}

export const sleep = async (time = 1000): Promise<void> => {
  return new Promise((res) => setTimeout(res, time));
};

export const isDev = () => {
  if (window.location.hostname.includes("staging.backyard.finance") || window.location.hostname.includes("localhost"))
    return true;
  return false;
};
