import { useState } from "react";
import { CreateDepositTransactionsDtoTypeEnum } from "@/api/generated/types/create-deposit-transactions-dto";
import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import PlusThickIcon from "@/icons/plus-thick.svg?react";
import { SlippageSettings } from "@/position-panel/components/SlippageSettings";
import { StrategyDeposit } from "@/position-panel/StrategyDeposit";
import { StrategyWithdraw } from "@/position-panel/StrategyWithdraw";
import { useStrategyContext } from "../context/StrategyContext";
import type { StrategyPosition } from "../hooks/useStrategyPosition";

export const StrategyControl = ({ strategyPosition }: { strategyPosition: StrategyPosition }) => {
  const [currentAction, setCurrentAction] = useState<CreateDepositTransactionsDtoTypeEnum>(
    CreateDepositTransactionsDtoTypeEnum.WITHDRAW
  );

  const {
    depositStrategy,
    slippage,
    handleSlippageChange,
    withdrawStrategy,
    handleDepositAmountChange,
    handleDepositAllocationChange,
    handleDepositRemoveVault,
    handleWithdrawAmountChange,
    handleWithdrawByVaultChange,
    handleWithdrawToggleVaultActive,
    handleWithdrawVaultAmountChange,
    handleWithdrawVaultAssetChange,
    handleWithdrawSelectedAssetChange,
  } = useStrategyContext();

  return (
    <div className="flex h-full flex-col gap-3 rounded-3xl border border-neutral-100 bg-neutral-50 px-[16px] py-[16px] pb-[23px] align-start">
      <div className="flex flex-row items-center justify-between font-bold text-neutral-800 text-sm">
        <Tabs
          onValueChange={(val) => setCurrentAction(val as CreateDepositTransactionsDtoTypeEnum)}
          value={currentAction}
          variant="gray"
        >
          <TabsList>
            <TabsTrigger value={CreateDepositTransactionsDtoTypeEnum.DEPOSIT}>Deposit</TabsTrigger>
            <TabsTrigger value={CreateDepositTransactionsDtoTypeEnum.WITHDRAW}>Withdraw</TabsTrigger>
          </TabsList>
        </Tabs>
        <SlippageSettings
          onSlippageChange={handleSlippageChange}
          sideOffset={currentAction === CreateDepositTransactionsDtoTypeEnum.DEPOSIT ? 16 : 50}
          slippage={slippage}
        />
      </div>
      {currentAction === CreateDepositTransactionsDtoTypeEnum.DEPOSIT ? (
        depositStrategy ? (
          <StrategyDeposit
            currentStrategy={depositStrategy}
            onAllocationChange={handleDepositAllocationChange}
            onDepositAmountChange={handleDepositAmountChange}
            onRemoveVault={handleDepositRemoveVault}
          />
        ) : (
          <div className="flex grow flex-col items-center justify-center gap-8 rounded-3xl bg-neutral-50">
            <div className="inline-flex h-12 w-12 rotate-90 items-center justify-center rounded-[64.50px] bg-neutral-200 p-3.5 outline-[0.72px] outline-white">
              <PlusThickIcon className="h-5 w-5" />
            </div>
            <div className="justify-start self-stretch text-center font-normal text-neutral-400 text-sm">
              Add strategies from the left to
              <br />
              deposit into the strategy
            </div>
          </div>
        )
      ) : (
        <StrategyWithdraw
          currentStrategy={withdrawStrategy}
          onToggleActiveVault={handleWithdrawToggleVaultActive}
          onVaultWithdrawAmountChange={handleWithdrawVaultAmountChange}
          onWithdrawAmountChange={handleWithdrawAmountChange}
          onWithdrawByVaultChange={handleWithdrawByVaultChange}
          onWithdrawSelectedAssetChange={handleWithdrawSelectedAssetChange}
          onWithdrawVaultAssetChange={handleWithdrawVaultAssetChange}
          strategyDepositedAmountUi={strategyPosition.strategyDepositedAmountUi}
        />
      )}
    </div>
  );
};
