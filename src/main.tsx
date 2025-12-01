import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "@/App.tsx";
import { TouchProvider } from "@/common/components/ui/hybrid-tooltip";
import { Toaster } from "@/common/components/ui/sonner";
import SolanaWalletProvider from "@/solana/solana-provider";

import "@/common/styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 60,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SolanaWalletProvider>
        <QueryClientProvider client={queryClient}>
          <TouchProvider>
            <Toaster />
            <App />
          </TouchProvider>
        </QueryClientProvider>
      </SolanaWalletProvider>
    </BrowserRouter>
  </React.StrictMode>
);
