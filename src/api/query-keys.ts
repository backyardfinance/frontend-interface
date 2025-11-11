export const queryKeys = {
  quote: {
    all: ["quote"],
    quoteDeposit: (data: object) => ["quote-deposit", ...Object.values(data)],
  },
  vaults: {
    all: ["vaults"],
    vaultByIdWithUser: (vaultId: string, userId: string) => [...queryKeys.vaults.all, vaultId, userId],
    vaultHistory: (vaultId: string) => [...queryKeys.vaults.all, "history", vaultId],
  },

  strategies: {
    all: ["strategies"],
    strategyById: (strategyId: string) => [...queryKeys.strategies.all, strategyId],
    strategyByUser: (userId: string) => [...queryKeys.strategies.all, "user", userId],
  },

  users: {
    all: ["users"],
    validateTwitter: (userId: string) => [...queryKeys.users.all, "validate-twitter", userId],
  },

  userTokens: (userId: string) => ["user-tokens", userId],
  quoteDeposit: (data: object) => ["quote-deposit", ...Object.values(data)],
} as const;

export type QueryKeys = typeof queryKeys;
