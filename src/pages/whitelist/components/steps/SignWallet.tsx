import bs58 from "bs58";
import { CheckIcon } from "lucide-react";
import { type FC, useState } from "react";
import { authApi } from "@/api";
import { useWhitelistVerifySignature } from "@/hooks/api/useWhitelist";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { Button, ErrorMessage, StepWrapper } from "@/pages/whitelist/components/ui";
import { truncateAddress } from "@/utils";

type Props = {
  isCompleted: boolean;
  connectedAddress: string | null | undefined;
};

export const SignWallet: FC<Props> = ({ connectedAddress, isCompleted }) => {
  const { signIn, address, signMessage } = useSolanaWallet();
  const { mutateAsync: verifySignature, error } = useWhitelistVerifySignature();

  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const { data: nonce } = await authApi.authControllerClaimNonce({ claimNonceDto: { wallet: address } });
      const signature = await signMessage(nonce.nonce);
      if (!signature) throw new Error("Failed to sign message");
      const signatureBase58 = bs58.encode(signature);
      await verifySignature({ wallet: address, signature: signatureBase58 });
    } catch (error) {
      console.error("Failed to sign message", error);
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="flex items-center gap-2 font-bold text-xs leading-[normal] sm:text-sm">
          /Sign wallet
          {connectedAddress && <span className="text-[#8D8D8D] text-xs">({truncateAddress(connectedAddress)})</span>}
        </p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper className="flex-col">
      <div className="flex w-full flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="font-bold text-white text-xs leading-[normal] sm:text-sm">
          /Sign wallet{" "}
          {connectedAddress && <span className="text-[#8D8D8D] text-xs">({truncateAddress(connectedAddress)})</span>}
        </p>
        {address ? (
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button border="none" className="flex-1 sm:flex-initial" loading={loading} onClick={handleSign} size="sm">
              Sign
            </Button>
          </div>
        ) : (
          <Button border="none" className="w-full sm:w-auto" onClick={signIn} size="sm">
            Connect wallet
          </Button>
        )}
      </div>
      {error && <ErrorMessage message={error.response?.data.message ?? "There was an error"} />}
    </StepWrapper>
  );
};
