import { CheckIcon } from "lucide-react";
import type { FC } from "react";
import { Button } from "@/pages/landing/button";
import { LockStep, StepWrapper } from "./ui";

// const authXLoginLink = "/auth/x/login";

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
      <p className="font-bold text-sm text-white leading-[normal]">/Follow @backyard_fi</p>
      <Button border="none" size="sm">
        Complete
      </Button>
    </StepWrapper>
  );
};
