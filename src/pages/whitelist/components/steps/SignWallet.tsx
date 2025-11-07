import { CheckIcon } from "lucide-react";
import type { FC } from "react";
import { DisconnectIcon } from "@/components/icons/disconnect";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useCreateUser } from "@/hooks/useUsers";
import { Button, ErrorMessage, StepWrapper } from "@/pages/whitelist/components/ui";
import { truncateAddress } from "@/utils";

type Props = {
  isCompleted: boolean;
};

export const SignWallet: FC<Props> = ({ isCompleted }) => {
  const { signIn, address, signOut } = useSolanaWallet();
  const { mutate: createUser, isPending, isError } = useCreateUser();

  const handleSign = async () => {
    if (!address) return;
    createUser({ name: "", walletAddress: address });
  };

  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="font-bold text-sm leading-[normal]">
          /Sign wallet {address && <span className="text-[#8D8D8D] text-xs">({truncateAddress(address)})</span>}
        </p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper className="flex-col">
      <div className="flex w-full items-center justify-between gap-4">
        <p className="font-bold text-sm text-white leading-[normal]">
          /Sign wallet {address && <span className="text-[#8D8D8D] text-xs">({truncateAddress(address)})</span>}
        </p>
        {address ? (
          <div className="flex items-center gap-2">
            <Button border="none" loading={isPending} onClick={handleSign} size="sm">
              Sign
            </Button>
            <Button border="none" className="min-w-none" disabled={isPending} onClick={signOut} size="sm">
              <DisconnectIcon color="white" fillOpacity="1" />
            </Button>
          </div>
        ) : (
          <Button border="none" onClick={signIn} size="sm">
            Connect wallet
          </Button>
        )}
      </div>
      {isError && <ErrorMessage message="This wallet is already on the whitelist" />}
    </StepWrapper>
  );
};
