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

  whitelist: {
    status: ["whitelist-status"],
    participants: ["whitelist-participants"],
    prepareMintTransaction: ["prepare-mint-transaction"],
    isMintedNFT: (walletAddress: string) => ["is-minted-nft", walletAddress],
  },

  userTokens: (userId: string) => ["user-tokens", userId],
  quoteDeposit: (data: object) => ["quote-deposit", ...Object.values(data)],
} as const;

export type QueryKeys = typeof queryKeys;
