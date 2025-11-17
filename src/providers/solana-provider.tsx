// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
// import { clusterApiUrl } from "@solana/web3.js";
import { type FC, type PropsWithChildren, useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";
// import { isDev } from "@/utils";

// const network =  WalletAdapterNetwork.Mainnet;

const SolanaWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const endpoint = 'https://mainnet.helius-rpc.com/?api-key=9394af7d-62ba-4dcd-a783-3d35c501e7d2';

  const wallets = useMemo(() => [new SolflareWalletAdapter(), new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;
