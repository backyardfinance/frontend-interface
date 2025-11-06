import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/utils";

const buttonVariants = cva(
  "flex h-[41px] cursor-pointer items-center justify-center gap-2 bg-white/5 px-3.5 font-bold text-sm text-white leading-[128%] shadow-[0_0_0_0_rgba(0,0,0,0.25)_inset] backdrop-blur-[2px] transition-all duration-300",
  {
    variants: {
      variant: {
        default: "",
        joinWhitelist:
          "hover:bg-[rgba(196,168,238,0.25)] hover:text-[#C4A8EE] active:bg-[rgba(196,168,238,0.25)] active:text-white/30",
        launch:
          "bg-[rgba(196,168,238,0.25)] text-[#C4A8EE] hover:bg-[#C4A8EE] hover:text-white active:bg-[rgba(196,168,238,0.40)] active:text-[rgba(196,168,238,0.33)]",
        readDocs: "text-[#C4A8EE]",
      },
      border: {
        default: "border border-white/30 border-dashed",
        none: "",
      },
      hover: {
        default: "",
        green:
          "hover:bg-[rgba(171,250,202,0.36)] hover:text-[#ABFACA] active:bg-[rgba(171,250,202,0.30)] active:text-[#303030]",
      },
    },
    defaultVariants: {
      variant: "default",
      border: "default",
      hover: "default",
    },
  }
);

function Button({
  className,
  variant,
  border,
  asChild = false,
  hover,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, border, hover, className }))} data-slot="button" {...props} />;
}

export { Button, buttonVariants };
