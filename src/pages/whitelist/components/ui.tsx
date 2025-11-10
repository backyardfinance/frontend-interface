import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { OTPInput, OTPInputContext } from "input-otp";
import { Loader2 } from "lucide-react";
import type { ComponentProps, FC, PropsWithChildren } from "react";
import { useContext } from "react";
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

const buttonVariants = cva(
  "flex cursor-pointer items-center justify-center gap-2 bg-white/3 px-3.5 font-bold text-sm text-white leading-[128%] shadow-[0_0_0_0_rgba(0,0,0,0.25)_inset] backdrop-blur-[2px] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-white/10 active:opacity-40",
        joinWhitelist:
          "hover:bg-[rgba(196,168,238,0.25)] hover:text-[#C4A8EE] active:bg-[rgba(196,168,238,0.25)] active:text-white/30",
        launch:
          "bg-[rgba(196,168,238,0.25)] text-[#C4A8EE] hover:bg-[#C4A8EE] hover:text-white active:bg-[rgba(196,168,238,0.40)] active:text-[rgba(196,168,238,0.33)]",
        readDocs: "text-[#C4A8EE]",
      },
      border: {
        default: "border border-white/15 border-dashed",
        none: "",
      },
      hover: {
        default: "",
        green:
          "hover:bg-[rgba(171,250,202,0.36)] hover:text-[#ABFACA] active:bg-[rgba(171,250,202,0.30)] active:text-[#303030]",
      },
      size: {
        default: "h-[41px]",
        sm: "h-[34px] min-w-[90px] text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      border: "default",
      hover: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  border,
  size,
  asChild = false,
  hover,
  loading,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, border, hover, size, className }))}
      data-slot="button"
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : props.children}
    </Comp>
  );
}

export { Button, buttonVariants };
