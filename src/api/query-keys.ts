export const queryKeys = {
  vaults: {
    all: ["vaults"],
    vaultById: (vaultId: string) => [...queryKeys.vaults.all, vaultId],
  },

  strategies: {
    all: ["strategies"],
    strategyByUser: (userId: string) => [...queryKeys.strategies.all, userId],
  },

  userTokens: (userId: string) => ["user-tokens", userId],
  quoteDeposit: (data: object) => ["quote-deposit", ...Object.values(data)],
} as const;

export type QueryKeys = typeof queryKeys;
