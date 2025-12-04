export const BACKEND_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL ?? "https://api.backyard.fi";

export const SOLANA_ENDPOINT =
  import.meta.env.VITE_PUBLIC_SOLANA_ENDPOINT ??
  "https://mainnet.helius-rpc.com/?api-key=9394af7d-62ba-4dcd-a783-3d35c501e7d2";

// -----------------------------------------------------------------------------------------------
// --------------------------------- Jupiter Ultra Swap API --------------------------------------
// -----------------------------------------------------------------------------------------------
export const JUPITER_API_URL = import.meta.env.VITE_PUBLIC_JUPITER_API_URL ?? "https://api.jup.ag";
export const JUPITER_API_KEY = import.meta.env.VITE_PUBLIC_JUPITER_API_KEY ?? "a83043f8-aee9-4238-9748-29bc8281f084";

// -----------------------------------------------------------------------------------------------
// --------------------------------- Jito RPC & Bundles ------------------------------------------
// -----------------------------------------------------------------------------------------------
export const JITO_RPC_URL = import.meta.env.VITE_PUBLIC_JITO_RPC_URL ?? "https://mainnet.block-engine.jito.wtf";
export const JITO_BUNDLES_URL = import.meta.env.VITE_PUBLIC_JITO_BUNDLES_URL ?? "https://bundles.jito.wtf";
