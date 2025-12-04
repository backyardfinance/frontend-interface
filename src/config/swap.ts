export const swapConfig = {
  // Retry settings
  maxRetries: 1,
  retryDelayMs: 2000,

  // Slippage
  defaultSlippageBps: 100,

  // Jito tip settings
  jitoTipMultiplier: 1.2,
  jitoMinTipLamports: 10000,
  jitoMaxTipLamports: 2000000,
  jitoTipEscalation: [1.0, 1.2, 1.5, 2.0],

  // Bundle confirmation
  bundleTimeoutMs: 60000,
  pollIntervalMs: 2000,
  maxPollAttempts: 30,

  // Transaction settings
  computeUnitBuffer: 1.2, // 20% buffer on compute units
} as const;

export type SwapConfig = typeof swapConfig;
