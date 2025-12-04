/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_BACKEND_URL: string;
  readonly VITE_PUBLIC_JUPITER_API_KEY: string;
  readonly VITE_PUBLIC_JUPITER_API_URL: string;
  readonly VITE_PUBLIC_JITO_RPC_URL: string;
  readonly VITE_PUBLIC_JITO_BUNDLES_URL: string;
  readonly VITE_PUBLIC_SOLANA_ENDPOINT: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
