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
    status: (walletAddress: string) => ["whitelist-status", walletAddress],
    participants: ["whitelist-participants"],
    prepareMintTransaction: ["prepare-mint-transaction"],
    isMintedNFT: (walletAddress: string) => ["is-minted-nft", walletAddress],
  },

  userTokens: (userId: string) => ["user-tokens", userId],
  quoteDeposit: (data: object) => ["quote-deposit", ...Object.values(data)],

  jupiter: {
    all: ["jupiter"],
    quote: (params: { inputMint: string; outputMint: string; amount: string; slippageBps?: number }) =>
      [...queryKeys.jupiter.all, "quote", params] as const,
    holdings: (walletAddress: string) => [...queryKeys.jupiter.all, "holdings", walletAddress] as const,
    search: (query: string) => [...queryKeys.jupiter.all, "search", query] as const,
    shield: (mints: string[]) => [...queryKeys.jupiter.all, "shield", mints.sort().join(",")] as const,
    routers: () => [...queryKeys.jupiter.all, "routers"] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
