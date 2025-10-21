/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_BACKEND_URL: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
