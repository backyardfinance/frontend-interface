import type { ComponentProps, FC, PropsWithChildren } from "react";
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
