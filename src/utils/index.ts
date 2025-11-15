import Big from "big.js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ValueType = string | number | Big;

export const BigNumber = (value: ValueType | undefined | null) => {
  try {
    return Big(value || ZERO_STRING);
  } catch (error) {
    console.warn(`Error: ${error} \n\n while working with this value ${value} of such a type ${typeof value} `);
    return Big(ZERO_STRING);
  }
};

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

export const formatWithPrecision = (number: number, precision = 2): string => {
  return Big(number).toFixed(precision);
};

export const parseTokenAmount = (amount: string, decimals = 18): Big => {
  return Big(amount).mul(Big(BASE).pow(decimals));
};

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

export const formatTokenAmount = (value: string | number | Big, decimals = 18, precision?: number): string =>
  BigNumber(value).div(BigNumber(BASE).pow(decimals)).toFixed(precision);

const MIN_AMOUNT = "0.00001";
const ZERO_STRING = "0";
const BASE = 10;

export const removeTrailingZeros = (amount: string) => {
  if (amount.includes(".") || amount.includes(",")) {
    return amount.replace(/\.?0*$/, "");
  }
  return amount;
};

export const displayAmount = (amount: string, decimals?: number, precision = 5): string => {
  const formateAmount = formatTokenAmount(amount, decimals || 0);
  const amountBig = BigNumber(formateAmount);
  if (amountBig.eq(ZERO_STRING)) return ZERO_STRING;
  if (amountBig.lte(MIN_AMOUNT)) return `>${MIN_AMOUNT}`;
  return removeTrailingZeros(amountBig.toFixed(precision));
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
  if(window.location.hostname.includes('backyard.finance')) return false;
  return  true;
};