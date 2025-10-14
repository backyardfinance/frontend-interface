import { useState } from "react";
import { SettingsIcon } from "@/components/icons/settings";
import { VaultCard } from "@/components/vault/VaultCard";
import { cn } from "@/utils";
import type { Vault } from "@/utils/types";

export interface StrategySetupProps {
  allocations?: number[];
  depositAmount: number;
  setAllocation: (index: number, allocation: number) => void;
  vaults: Vault[];
  slippage: number;
  setSlippage: (slippage: number) => void;
}

export type Action = "Deposit" | "Withdraw";
const slippageOptions = [0.1, 0.5, 1, 3];

export const StrategySetup = ({
  allocations,
  depositAmount,
  setAllocation,
  vaults,
  slippage,
  setSlippage,
}: StrategySetupProps) => {
  const [currentAction, setCurrentAction] = useState<Action>("Deposit");
  console.log("currentAction", currentAction, setCurrentAction, depositAmount);
  const [isSlippageOpen, setIsSlippageOpen] = useState(false);
  const totalAllocation = allocations?.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="flex flex-col gap-[13px] rounded-3xl border-1 border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      <div className="flex flex-row items-start justify-between font-['Product_Sans'] font-bold text-neutral-800 text-sm">
        Strategy setup
        <button
          className="cursor-pointer rounded-xl border-1 border-zinc-100 bg-white p-1.5"
          onClick={() => setIsSlippageOpen(!isSlippageOpen)}
          type="button"
        >
          <SettingsIcon />
        </button>
      </div>
      {isSlippageOpen && (
        <div className="flex flex-col gap-[16px] rounded-3xl border-2 border-zinc-300/25 bg-white p-[14px]">
          <div className="flex flex-row items-center justify-between font-['Product_Sans'] font-bold text-base text-neutral-800">
            Slippage
            <span className="font-['Product_Sans'] font-bold text-sm text-zinc-400">{slippage}%</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            {slippageOptions.map((option) => (
              <button
                className={cn(
                  "min-w-[50px] rounded-xl bg-neutral-50 p-[9px] font-['Product_Sans'] font-bold text-sm text-zinc-400",
                  option === slippage &&
                    "rounded-xl border-1 border-zinc-100 bg-neutral-50 font-bold text-sm text-zinc-800"
                )}
                key={option}
                onClick={() => setSlippage(option)}
                type="button"
              >
                {option}%
              </button>
            ))}
          </div>
        </div>
      )}
      {allocations?.length && (
        <>
          <div className="flex w-full flex-row items-center justify-between">
            <span className="justify-start font-['Product_Sans'] font-bold text-neutral-800 text-sm">Allocation</span>
            <div className="flex flex-row items-center font-['Product_Sans'] font-bold text-neutral-800 text-sm">
              <span className="font-['Product_Sans'] font-bold text-sm text-zinc-400">{totalAllocation}</span>
              /100%
            </div>
          </div>
          {vaults.map((vault, index) => (
            <VaultCard
              allocation={allocations?.[index]}
              depositAmount={5000}
              key={vault.id}
              setAllocation={(amount) => setAllocation(index, amount)}
              vault={vault}
            />
          ))}
        </>
      )}
    </div>
  );
};
