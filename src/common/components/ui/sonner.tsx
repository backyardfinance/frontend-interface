import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, X } from "lucide-react";
import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from "sonner";
import { Button } from "@/common/components/ui/button";
import CheckIcon from "@/icons/check.png";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      duration={Infinity}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      position="top-right"
      richColors
      theme="dark"
      {...props}
    />
  );
};

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  tokenIcon: React.ReactNode;
  leftAction?: {
    label: string;
    onClick: () => void;
  };
  rightAction?: {
    label: string;
    onClick: () => void;
  };
}

/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => <Toast {...toast} id={id} />);
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast({ title, description, leftAction, rightAction, id, tokenIcon }: ToastProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-3xl border border-[#F3F3F3] border-solid py-3.5 pr-2.5 pl-3.5 [background:#FFF]">
      <div className="flex w-full gap-2">
        <img alt="check" className="size-9" src={CheckIcon} />
        <div className="flex w-full flex-1 flex-col">
          <p className="flex justify-between font-bold text-neutral-800 text-sm leading-[normal]">
            {title}
            <X className="size-4 text-[#8A8A8A]" onClick={() => sonnerToast.dismiss(id)} />
          </p>
          <p className="mt-1 flex items-center gap-1 font-normal text-[#8A8A8A] text-[11px] leading-[normal]">
            {description} <div className="size-3">{tokenIcon}</div>
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {leftAction && (
          <Button
            className="rounded-[10px] border-none px-2.5 py-[7px] text-[11px]"
            onClick={leftAction.onClick}
            variant="secondary"
          >
            {leftAction.label}
          </Button>
        )}
        {rightAction && (
          <Button
            className="rounded-[10px] border-none px-2.5 py-[7px] text-[11px]"
            onClick={rightAction.onClick}
            variant="secondary"
          >
            {rightAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}

export { Toaster, toast };
