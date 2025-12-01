import type { StrategyInfoResponse, UserTokenView } from "@/api";

export type WithdrawalStrategy = StrategyInfoResponse & {
  isActive: boolean;
  selectedAsset: string;
  amountWithdraw: number;
};

export const initializeWithdrawalStrategies = (
  strategies: StrategyInfoResponse[] | undefined,
  defaultToken: string
): WithdrawalStrategy[] => {
  if (!strategies) return [];

  return strategies.map((strategy) => ({
    ...strategy,
    isActive: true,
    selectedAsset: defaultToken,
    amountWithdraw: 0,
  }));
};

export const updateStrategyActiveState = (
  strategies: WithdrawalStrategy[],
  strategyId: string,
  isActive: boolean
): WithdrawalStrategy[] => {
  return strategies.map((strategy) => (strategy.strategyId === strategyId ? { ...strategy, isActive } : strategy));
};

export const updateStrategyAmount = (
  strategies: WithdrawalStrategy[],
  strategyId: string,
  amount: number
): WithdrawalStrategy[] => {
  return strategies.map((strategy) =>
    strategy.strategyId === strategyId ? { ...strategy, amountWithdraw: amount } : strategy
  );
};

export const updateStrategyAsset = (
  strategies: WithdrawalStrategy[],
  strategyId: string,
  assetAddress: string
): WithdrawalStrategy[] => {
  return strategies.map((strategy) =>
    strategy.strategyId === strategyId ? { ...strategy, selectedAsset: assetAddress } : strategy
  );
};

export const getSelectedTokensForWithdrawal = (
  strategies: WithdrawalStrategy[],
  availableTokens: Map<string, UserTokenView>
) => {
  return strategies
    .filter((strategy) => strategy.isActive)
    .map((strategy) => {
      const token = availableTokens.get(strategy.selectedAsset);
      return {
        tokenId: strategy.selectedAsset,
        amount: strategy.amountWithdraw,
        token,
      };
    });
};

export const calculateWithdrawalValue = (
  strategies: WithdrawalStrategy[],
  availableTokens: Map<string, UserTokenView>
): number => {
  return strategies
    .filter((strategy) => strategy.isActive)
    .reduce((total, strategy) => {
      const token = availableTokens.get(strategy.selectedAsset);
      const tokenPrice = token?.usdPrice || 0;
      return total + strategy.amountWithdraw * tokenPrice;
    }, 0);
};
