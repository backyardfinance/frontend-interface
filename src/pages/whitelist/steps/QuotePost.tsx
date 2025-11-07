import { CheckIcon } from "lucide-react";
import type { FC } from "react";
import { Button } from "@/pages/landing/button";
import { LockStep, StepWrapper } from "./ui";

type Props = {
  disabled: boolean;
  isCompleted: boolean;
};

export const QuotePost: FC<Props> = ({ disabled, isCompleted }) => {
  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="font-bold text-sm leading-[normal]">/Quote post</p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  if (disabled) {
    return (
      <StepWrapper>
        <p className="font-bold text-[#606060] text-sm leading-[normal]">/Quote post</p>
        <LockStep />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper>
      <p className="font-bold text-sm text-white leading-[normal]">/Quote post</p>
      <Button border="none" size="sm">
        Complete
      </Button>
    </StepWrapper>
  );
};
