import { useCallback } from "react";
import type { UserTokenView } from "@/api";
import { Button } from "@/common/components/ui/button";
import { Switch } from "@/common/components/ui/switch";
import { FeesDisplay } from "@/position-panel/components/FeesDisplay";
import { VaultWithdrawCard } from "@/position-panel/components/VaultWithdrawCard";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { useUserTokens } from "@/solana/hooks/useUserTokens";
import type { WithdrawStrategy } from "@/strategy/context/StrategyContext";
import { SummaryRow } from "./components/SummaryRow";
import { WithdrawTokenInput } from "./components/WithdrawTokenInput";

interface StrategyWithdrawProps {
  strategyDepositedAmountUi: number;
  currentStrategy: WithdrawStrategy;
  onWithdrawAmountChange: (amount: number) => void;
  onWithdrawByVaultChange: (isActive: boolean) => void;
  onToggleActiveVault: (vaultId: string, isActive: boolean) => void;
  onVaultWithdrawAmountChange: (vaultId: string, amount: number) => void;
  onWithdrawVaultAssetChange: (vaultId: string, asset: UserTokenView) => void;
}

export const StrategyWithdraw = ({
  strategyDepositedAmountUi,
  currentStrategy,
  onWithdrawAmountChange,
  onWithdrawByVaultChange,
  onToggleActiveVault,
  onVaultWithdrawAmountChange,
  onWithdrawVaultAssetChange,
}: StrategyWithdrawProps) => {
  const { address: walletAddress } = useSolanaWallet();

  const { withdrawAmount, vaults, isWithdrawByVault } = currentStrategy;

  const { userTokens } = useUserTokens();

  const handleDepositWithdraw = useCallback(() => {
    console.log("handleDepositWithdraw");
  }, []);

  const isDepositDisabled = !withdrawAmount || vaults?.length === 0 || !walletAddress;

  return (
    <>
      <div className="my-1 flex flex-row items-center justify-between px-5">
        <p className="font-bold text-sm leading-[normal]">Withdraw by vault</p>
        <Switch checked={isWithdrawByVault} onCheckedChange={onWithdrawByVaultChange} />
      </div>
      {isWithdrawByVault ? (
        <div className="flex flex-col gap-2">
          {vaults.map((vault) => (
            <VaultWithdrawCard
              assets={userTokens.arr}
              key={vault.id}
              onToggleActiveVault={onToggleActiveVault}
              onWithdrawAmountChange={onVaultWithdrawAmountChange}
              onWithdrawAssetChange={onWithdrawVaultAssetChange}
              vault={vault}
            />
          ))}
        </div>
      ) : (
        <WithdrawTokenInput
          assets={userTokens.arr}
          availableAmount={strategyDepositedAmountUi}
          currentValue={withdrawAmount}
          selectedAsset={vaults[0].token}
          setCurrentValue={onWithdrawAmountChange}
          setSelectedAsset={(token) => {
            console.log("setSelectedAsset", token);
          }}
          title="Total withdraw amount"
        />
      )}

      {/* {depositAmount > 0 && selectedAsset && quotes.length > 0 && (
        <div className="flex flex-col gap-2">
          {quotes.map((quote) => {
            if (!quote.data || quote.error || !quotesParams) return null;
            return (
              <RouteDisplay
                key={quote.data.expireAt}
                routeSteps={quote.data.routePlan.map((step) => (
                  <>
                    {step.swapInfo.label}
                    <span className="font-bold text-neutral-700 text-xs">
                      {step.swapInfo.inAmount} {step.swapInfo.inputMint}
                    </span>
                  </>
                ))}
              />
            );
          })}
        </div>
      )} */}

      <div className="h-px w-80 rounded-2xl bg-zinc-100" />

      <div className="flex w-full flex-col justify-start gap-[3px]">
        <SummaryRow
          amount={withdrawAmount}
          label="Total to withdraw"
          symbol={vaults[0].token.symbol}
          usdPrice={vaults[0].token.usdPrice}
        />
      </div>

      <div className="flex flex-col gap-[9px] rounded-2xl border border-zinc-100 bg-white">
        <Button disabled={isDepositDisabled} onClick={handleDepositWithdraw} size="xl" variant="tertiary">
          {walletAddress ? "Withdraw" : "Connect wallet"}
        </Button>
        <FeesDisplay depositFee={0} routeFee={0} />
      </div>
    </>
  );
};
