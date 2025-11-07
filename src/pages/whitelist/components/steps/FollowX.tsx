import { CheckIcon } from "lucide-react";
import type { FC } from "react";
import { links } from "@/config/links";
import { Button, LockStep, StepWrapper } from "@/pages/whitelist/components/ui";

const authXLoginLink = `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/auth/x/login`;

type Props = {
  disabled: boolean;
  isCompleted: boolean;
};

export const FollowX: FC<Props> = ({ disabled, isCompleted }) => {
  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="font-bold text-sm leading-[normal]">/Follow @backyard_fi</p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  if (disabled) {
    return (
      <StepWrapper>
        <p className="font-bold text-[#606060] text-sm leading-[normal]">/Follow @backyard_fi</p>
        <LockStep />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper>
      <p className="font-bold text-sm text-white leading-[normal]">
        /Follow{" "}
        <a className="underline" href={links.x} rel="noopener" target="_blank">
          @backyard_fi
        </a>
      </p>
      <Button asChild border="none" size="sm">
        <a href={authXLoginLink}>Complete</a>
      </Button>
    </StepWrapper>
  );
};
