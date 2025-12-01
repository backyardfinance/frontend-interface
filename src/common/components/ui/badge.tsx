import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/common/utils";

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-[19px] border border-slate-200 px-2 font-medium text-xs transition-[color,box-shadow] aria-invalid:border-red-500 aria-invalid:ring-red-500/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-900 text-slate-50",
        secondary: "border-transparent bg-[#FAFAFA] text-[#383838]",
      },
      text: {
        xs: "font-bold text-xs leading-[normal]",
        xxs: "font-normal text-[9px] leading-[normal]",
      },
    },
    defaultVariants: {
      variant: "default",
      text: "xs",
    },
  }
);

function Badge({
  className,
  variant,
  text,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp className={cn(badgeVariants({ variant, text }), className)} data-slot="badge" {...props} />;
}

export { Badge, badgeVariants };
