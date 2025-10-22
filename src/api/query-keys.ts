export const queryKeys = {
  vaults: {
    all: ["vaults"],
  },

  strategies: {
    all: ["strategies"],
    strategyByUser: (userId: string) => [...queryKeys.strategies.all, userId],
  },

  userTokens: (userId: string) => ["user-tokens", userId],
  quoteDeposit: (data: object) => ["quote-deposit", ...Object.values(data)],
} as const;

export type QueryKeys = typeof queryKeys;
