import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "@/App.tsx";
import { TouchProvider } from "@/components/ui/hybrid-tooltip";
import { QueryProvider } from "@/providers/query-provider.tsx";
import SolanaWalletProvider from "@/providers/solana-provider.tsx";

import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SolanaWalletProvider>
        <QueryProvider>
          <TouchProvider>
            <App />
          </TouchProvider>
        </QueryProvider>
      </SolanaWalletProvider>
    </BrowserRouter>
  </React.StrictMode>
);
