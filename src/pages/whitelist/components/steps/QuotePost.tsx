import { CheckIcon } from "lucide-react";
import type { FC } from "react";
import { links } from "@/config/links";
import { useWhitelistCheckRetweet } from "@/hooks/api/useWhitelist";
import { Button, ErrorMessage, LockStep, StepWrapper } from "@/pages/whitelist/components/ui";

type Props = {
  disabled: boolean;
  isCompleted: boolean;
};

export const QuotePost: FC<Props> = ({ disabled, isCompleted }) => {
  const { mutate: checkRetweet, isPending, data } = useWhitelistCheckRetweet();

  const handleCheckRetweet = () => {
    checkRetweet();
  };

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

  return (
    <StepWrapper className="flex-col">
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="flex w-full gap-2 font-bold text-white text-xs leading-[normal] sm:w-auto sm:text-sm">
          /Quote
          <a className="underline" href={links.x_post} rel="noopener" target="_blank">
            post
          </a>
        </p>
        <Button border="none" className="w-full sm:w-auto" loading={isPending} onClick={handleCheckRetweet} size="sm">
          Verify
        </Button>
      </div>
      {data && !data.data.has_retweeted && <ErrorMessage message="You are not retweeted or your account is private." />}
    </StepWrapper>
  );
};
