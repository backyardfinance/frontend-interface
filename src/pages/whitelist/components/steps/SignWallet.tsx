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
        <p className="font-bold text-xs leading-[normal] sm:text-sm">
          /Sign wallet {address && <span className="text-[#8D8D8D] text-xs">({truncateAddress(address)})</span>}
        </p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper className="flex-col">
      <div className="flex w-full flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="font-bold text-white text-xs leading-[normal] sm:text-sm">
          /Sign wallet {address && <span className="text-[#8D8D8D] text-xs">({truncateAddress(address)})</span>}
        </p>
        {address ? (
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button border="none" className="flex-1 sm:flex-initial" loading={isPending} onClick={handleSign} size="sm">
              Sign
            </Button>
            <Button border="none" className="min-w-none flex-shrink-0" disabled={isPending} onClick={signOut} size="sm">
              <DisconnectIcon color="white" fillOpacity="1" />
            </Button>
          </div>
        ) : (
          <Button border="none" className="w-full sm:w-auto" onClick={signIn} size="sm">
            Connect wallet
          </Button>
        )}
      </div>
      {isError && <ErrorMessage message="This wallet is already on the whitelist" />}
    </StepWrapper>
  );
};
