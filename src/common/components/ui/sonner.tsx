import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, X } from "lucide-react";
import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from "sonner";
import { cn } from "@/common/utils";
import { Button } from "./button";

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

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost";
}

interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant?: ToastVariant;
  icon?: React.ReactNode;
  actions?: ToastAction[];
}

const variantConfig: Record<ToastVariant, { accentColor: string; icon: React.ReactNode }> = {
  success: {
    accentColor: "text-emerald-700",
    icon: <CircleCheckIcon className="size-full" />,
  },
  error: {
    accentColor: "text-red-700",
    icon: <OctagonXIcon className="size-full" />,
  },
  info: {
    accentColor: "text-sky-700",
    icon: <InfoIcon className="size-full" />,
  },
  warning: {
    accentColor: "text-amber-700",
    icon: <TriangleAlertIcon className="size-full" />,
  },
};

/** A fully custom toast that still maintains the animations and interactions. */
function Toast({ title, description, actions, id, variant = "info", icon }: ToastProps) {
  const config = variantConfig[variant];

  return (
    <div className="fade-in slide-in-from-right-full flex min-w-[320px] max-w-[400px] animate-in flex-col gap-3 overflow-hidden rounded-3xl border border-[#F3F3F3] border-solid py-3.5 pr-2.5 pl-3.5 shadow-2xl shadow-black/50 duration-300 [background:#FFF]">
      <div className="flex w-full gap-2">
        <div className={cn("size-9 shrink-0", config.accentColor)}>{icon || config.icon}</div>
        <div className="flex w-full flex-1 flex-col">
          <div className="flex justify-between">
            <h3 className="font-semibold text-sm leading-tight tracking-tight">{title}</h3>
            <button
              className="shrink-0 rounded-lg p-1 text-neutral-700 transition-colors hover:bg-neutral-700/10 hover:text-neutral-700"
              onClick={() => sonnerToast.dismiss(id)}
              type="button"
            >
              <X className="size-3.5" />
            </button>
          </div>
          {description && <p className="text-neutral-700 text-xs leading-relaxed">{description}</p>}
        </div>
      </div>

      {actions && actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action) => (
            <Button
              className="flex-1 rounded-xl border-none px-2.5 py-2 text-xs"
              key={action.label}
              onClick={action.onClick}
              type="button"
              variant={action.variant === "primary" ? "default" : "secondary"}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Helper function to show custom toast */
const toast = (props: Omit<ToastProps, "id">) => {
  return sonnerToast.custom((id) => <Toast {...props} id={id} />);
};

toast.success = (title: string, options?: Omit<ToastProps, "id" | "title" | "variant">) =>
  toast({ title, variant: "success", ...options });

toast.error = (title: string, options?: Omit<ToastProps, "id" | "title" | "variant">) =>
  toast({ title, variant: "error", ...options });

toast.info = (title: string, options?: Omit<ToastProps, "id" | "title" | "variant">) =>
  toast({ title, variant: "info", ...options });

toast.warning = (title: string, options?: Omit<ToastProps, "id" | "title" | "variant">) =>
  toast({ title, variant: "warning", ...options });

toast.dismiss = sonnerToast.dismiss;

export { Toaster, toast };
export type { ToastProps, ToastAction, ToastVariant };
