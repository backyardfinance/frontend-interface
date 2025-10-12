import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "@/App.tsx";
import SolanaWalletProvider from "@/providers/solana-provider.tsx";

import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SolanaWalletProvider>
        <App />
      </SolanaWalletProvider>
    </BrowserRouter>
  </React.StrictMode>
);
