import { CheckIcon } from "lucide-react";
import { type FC, useState } from "react";
import { usersApi } from "@/api";
import { useIsMintedNFT } from "@/hooks/api/useWhitelistNFT";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { Button, LockStep, StepWrapper } from "@/pages/whitelist/components/ui";
import { truncateAddress } from "@/utils";

type Props = {
  disabled: boolean;
  connectedAddress: string | null | undefined;
};

export const MintNFT: FC<Props> = ({ disabled, connectedAddress }) => {
  const { sendV0Transaction } = useSolanaWallet();
  const { data: isCompleted, refetch: refetchIsMintedNFT } = useIsMintedNFT(connectedAddress ?? "");
  const [isMinting, setIsMinting] = useState(false);

  const mintNFT = async () => {
    try {
      if (!connectedAddress) throw new Error("Wallet not connected");
      setIsMinting(true);

      const {
        data: { transaction: rawTxBase64 },
      } = await usersApi.userControllerPrepareMintTransaction();

      await sendV0Transaction(rawTxBase64);

      await refetchIsMintedNFT();
    } finally {
      setIsMinting(false);
    }
  };

  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="flex items-center gap-2 font-bold text-xs leading-[normal] sm:text-sm">/Mint NFT</p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  if (disabled) {
    return (
      <StepWrapper>
        <p className="font-bold text-[#606060] text-xs leading-[normal] sm:text-sm">/NFT</p>
        <LockStep />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper className="flex-col">
      <div className="flex w-full flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="flex items-center gap-2 font-bold text-white text-xs leading-[normal] sm:text-sm">
          /NFT
          {connectedAddress && <span className="text-[#8D8D8D] text-xs">({truncateAddress(connectedAddress)})</span>}
        </p>
        <Button border="none" className="flex-1 sm:flex-initial" loading={isMinting} onClick={mintNFT} size="sm">
          Mint NFT
        </Button>
      </div>
    </StepWrapper>
  );
};
