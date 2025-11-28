import Big from "big.js";
import { cn } from "@/common/utils";

interface SummaryRowProps {
  label: string;
  amount?: number;
  symbol?: string;
  usdPrice?: number;
  valueColor?: string;
  showUsd?: boolean;
}

export const SummaryRow = ({
  label,
  amount,
  symbol,
  usdPrice = 0,
  valueColor = "text-neutral-700",
  showUsd = true,
}: SummaryRowProps) => {
  const hasValue = amount !== undefined && amount > 0;
  const usdValue = hasValue && usdPrice ? Big(amount.toString()).mul(usdPrice).toFixed(2) : "0.00";

  return (
    <div className="flex flex-row items-start justify-between">
      <span className="font-bold text-neutral-700 text-xs">{label}</span>
      <div className="flex flex-col items-end">
        <span className={cn("font-bold text-xs", valueColor)}>
          {hasValue ? amount : ""} {symbol ?? ""}
        </span>
        {showUsd && <span className="font-normal text-[9px] text-stone-300">${usdValue}</span>}
      </div>
    </div>
  );
};
