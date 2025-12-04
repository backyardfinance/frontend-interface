import { Big } from "big.js";

export const removeTrailingZeros = (amount: string) => {
  if (amount.includes(".") || amount.includes(",")) {
    return amount.replace(/\.?0*$/, "");
  }
  return amount;
};

/**
 * @example
 * parseUnits("1000", 18) = "10000000000000000000"
 */
export const parseUnits = (value: string, decimals: number, precision = 0) => {
  try {
    return Big(value).mul(Big(10).pow(decimals)).toFixed(precision);
  } catch {
    return "0";
  }
};

/**
 * @example
 * formatUnits("420000000000", 9) = "42"
 */
export const formatUnits = (value: string, decimals: number, precision = 4) => {
  try {
    return removeTrailingZeros(Big(value).div(Big(10).pow(decimals)).toFixed(precision));
  } catch {
    return "0";
  }
};

export const displayAmount = (amount: string, decimals?: number, precision = 4): string => {
  const formateAmount = formatUnits(amount, decimals || 0);
  const amountBig = Big(formateAmount);
  if (amountBig.eq(0)) return "0";
  if (amountBig.lte(0.0001)) return `>0.0001`;
  return removeTrailingZeros(amountBig.toFixed(precision));
};
