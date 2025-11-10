import { CheckIcon } from "lucide-react";
import type { FC } from "react";
import { Button, LockStep, StepWrapper } from "@/pages/whitelist/components/ui";

type Props = {
  disabled: boolean;
  isCompleted: boolean;
};

export const QuotePost: FC<Props> = ({ disabled, isCompleted }) => {
  if (isCompleted) {
    return (
      <StepWrapper isCompleted>
        <p className="font-bold text-xs leading-[normal] sm:text-sm">/Quote post</p>
        <CheckIcon className="size-4" />
      </StepWrapper>
    );
  }

  if (disabled) {
    return (
      <StepWrapper>
        <p className="font-bold text-[#606060] text-xs leading-[normal] sm:text-sm">/Quote post</p>
        <LockStep />
      </StepWrapper>
    );
  }

  //TODO: add quote post button
  return (
    <StepWrapper className="flex-col sm:flex-row">
      <p className="w-full font-bold text-white text-xs leading-[normal] sm:w-auto sm:text-sm">/Quote post</p>
      <Button border="none" className="w-full sm:w-auto" size="sm">
        Complete
      </Button>
    </StepWrapper>
  );
};
