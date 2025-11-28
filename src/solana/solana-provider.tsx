// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
// import { clusterApiUrl } from "@solana/web3.js";
import { type FC, type PropsWithChildren, useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";
import { SOLANA_ENDPOINT } from "@/config";

// import { isDev } from "@/utils";

// const network =  WalletAdapterNetwork.Mainnet;

const SolanaWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const wallets = useMemo(() => [new SolflareWalletAdapter(), new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={SOLANA_ENDPOINT}>
      <WalletProvider autoConnect wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;
