import { CheckIcon } from "lucide-react";
import type { FC } from "react";
import { links } from "@/config/links";
import { useWhitelistCheckFollow } from "@/hooks/useWhitelist";
import { Button, ErrorMessage, LockStep, StepWrapper } from "@/pages/whitelist/components/ui";
import { localStorageService } from "@/services/localStorageService";

type Props = {
  connectedX: string | null | undefined;
  disabled: boolean;
  isCompleted: boolean;
  xConnected: boolean;
};

export const FollowX: FC<Props> = ({ connectedX, disabled, isCompleted, xConnected }) => {
  const { mutate: checkFollow, isPending, data } = useWhitelistCheckFollow();

  const handleCheckFollow = () => {
    checkFollow();
  };

  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="flex gap-1 font-bold text-xs leading-[normal] sm:text-sm">
          /Follow
          <a className="underline" href={links.x} rel="noopener" target="_blank">
            @backyard_fi
          </a>
          {connectedX && <span className="text-[#8D8D8D] text-xs">({connectedX})</span>}
        </p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  if (disabled) {
    return (
      <StepWrapper>
        <p className="font-bold text-[#606060] text-xs leading-[normal] sm:text-sm">/Follow @backyard_fi</p>
        <LockStep />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper className="flex-col">
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="flex w-full gap-2 font-bold text-white text-xs leading-[normal] sm:w-auto sm:text-sm">
          /Follow
          <a className="underline" href={links.x} rel="noopener" target="_blank">
            @backyard_fi
          </a>
          {connectedX && <span className="text-[#8D8D8D] text-xs">({connectedX})</span>}
        </p>
        {xConnected ? (
          <Button border="none" className="w-full sm:w-auto" loading={isPending} onClick={handleCheckFollow} size="sm">
            Complete
          </Button>
        ) : (
          <Button border="none" className="w-full sm:w-auto" size="sm">
            <a
              href={`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/auth/x/login?token=${localStorageService.getAccessToken()}`}
            >
              Connect X
            </a>
          </Button>
        )}
      </div>
      {data && !data.data.is_following && <ErrorMessage message="You are not subscribed or your account is private." />}
    </StepWrapper>
  );
};
