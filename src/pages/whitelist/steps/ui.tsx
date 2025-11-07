import { type ComponentProps, type FC, type PropsWithChildren, useContext } from "react";
import LockIcon from "@/assets/landing/lock.webp";
import { cn } from "@/utils";

type StepWrapperProps = PropsWithChildren<{
  isCompleted?: boolean;
  className?: string;
}>;

export const StepWrapper: FC<StepWrapperProps> = ({ children, isCompleted, className }) => {
  return (
    <div
      className={cn(
        "flex min-h-15 w-full items-center justify-between gap-2.5 border border-white/9 border-dashed bg-white/3 py-3 pr-3.5 pl-[21px]",
        isCompleted && "border-[rgba(171,250,202,0.59)] bg-[rgba(171,250,202,0.23)] text-[#ABFACA]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ErrorMessage: FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex w-full items-center bg-[rgba(255,208,219,0.10)] px-3 py-2.5">
      <span className="font-bold text-[#F897AC] text-[10px] leading-[128%] tracking-[1px]">{message}</span>
    </div>
  );
};

export const InfoMessage: FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex w-full items-center bg-[rgba(227,208,255,0.10)] px-3 py-2.5">
      <span className="font-bold text-[#E3D0FF] text-[10px] leading-[128%] tracking-[1px]">{message}</span>
    </div>
  );
};

export const LockStep = () => {
  return (
    <div className="flex size-[34px] items-center justify-center [background:rgba(255,255,255,0.03)]">
      <img alt="lock" className="h-[22px] w-[17px]" src={LockIcon} />
    </div>
  );
};

export const EmailInput: FC<ComponentProps<"input">> = (props) => {
  return (
    <input
      className={cn(
        "h-[34px] w-full border border-white/9 border-dashed bg-[rgba(39,39,39,0.22)] px-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.10)_inset]",
        "font-bold text-xs leading-[normal]",
        "aria-invalid:border-[rgba(248,151,172,0.59)] aria-invalid:bg-[rgba(255,208,219,0.10)]",
        "outline-none",
        props.className
      )}
      type="email"
      {...props}
    />
  );
};

import { OTPInput, OTPInputContext } from "input-otp";

export function InputOTP({
  className,
  containerClassName,
  ...props
}: ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      className={cn("disabled:cursor-not-allowed", className)}
      containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)}
      data-slot="input-otp"
      {...props}
    />
  );
}

export function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-center gap-4", className)} data-slot="input-otp-group" {...props} />;
}

export function InputOTPSlot({
  index,
  className,
  ...props
}: ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      className={cn(
        "relative flex size-8.5 items-center justify-center border border-white/25 border-dashed bg-[rgba(39,39,39,0.22)] shadow-[4px_4px_0_0_rgba(0,0,0,0.10)_inset] outline-none transition-all",
        "aria-invalid:border-[rgba(248,151,172,0.59)] aria-invalid:bg-[rgba(255,208,219,0.10)] data-[active=true]:aria-invalid:ring-[rgba(248,151,172,0.59)]",
        "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50",
        className
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-white duration-1000" />
        </div>
      )}
    </div>
  );
}
