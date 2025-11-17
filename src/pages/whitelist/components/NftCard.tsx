import { useState } from "react";
import { usersApi } from "@/api";
import NFT from "@/assets/landing/nft.webp";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useIsMintedNFT } from "@/hooks/useWhitelistNFT";
import { Button } from "@/pages/whitelist/components/ui";
import { Card } from "./Card";

export const NftCard = () => {
  const { address, sendV0Transaction } = useSolanaWallet();
  const { data: isMintedNFT, refetch: refetchIsMintedNFT } = useIsMintedNFT(address ?? "");
  const [isMinting, setIsMinting] = useState(false);

  const mintNFT = async () => {
    try {
      if (!address) throw new Error("Wallet not connected");
      setIsMinting(true);

      const {
        data: { transaction: rawTxBase64 },
      } = await usersApi.userControllerPrepareMintTransaction();

      const signature = await sendV0Transaction(rawTxBase64);

      console.log("signature:", signature);

      await refetchIsMintedNFT();
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="h-[263px] w-[269px] flex-shrink-0 p-4">
      <div className="relative size-full overflow-hidden">
        <img alt="nft" className="absolute" src={NFT} />
        {isMintedNFT ? (
          <p className="-translate-x-1/2 absolute bottom-[6px] left-1/2 flex w-[calc(100%-12px)] flex-col items-center justify-center gap-2.5 bg-[rgba(39,39,39,0.37)] px-4 py-3 font-bold text-xs leading-[normal]">
            NFT minted
          </p>
        ) : (
          <Button
            border="none"
            className="-translate-x-1/2 absolute bottom-[6px] left-1/2 w-[calc(100%-12px)] bg-[#272727]"
            loading={isMinting}
            onClick={mintNFT}
          >
            {isMinting ? "Minting..." : "Mint NFT"}
          </Button>
        )}
      </div>
    </Card>
  );
};
