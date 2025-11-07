import type { FC } from "react";
import { ClockIcon } from "@/components/icons/clock";

type ResendTimerProps = {
  resendTimer: number;
  onResendCode: () => void;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const ResendTimer: FC<ResendTimerProps> = ({ resendTimer, onResendCode }) => {
  if (resendTimer > 0) {
    return (
      <p className="flex items-center gap-1.5">
        <span className="font-bold text-[#E3D0FF] text-[10px] leading-[128%] tracking-[1px]">Resend in</span>
        <span className="flex items-center gap-1 font-bold text-[#8D8D8D] text-[10px] leading-[128%] tracking-[1px]">
          <ClockIcon className="size-[9px]" />
          {formatTime(resendTimer)}
        </span>
      </p>
    );
  }

  return (
    <button
      className="cursor-pointer font-bold text-[#E3D0FF] text-[10px] leading-[128%] tracking-[1px] underline"
      onClick={onResendCode}
      type="button"
    >
      Resend code
    </button>
  );
};
