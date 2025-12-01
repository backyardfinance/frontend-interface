import type * as React from "react";
import { useRef } from "react";

import { cn } from "@/common/utils";

function Input({
  className,
  type,
  leftIcon,
  ...props
}: React.ComponentProps<"input"> & { leftIcon?: React.ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <button
      className={cn(
        "flex h-9 w-full min-w-0 cursor-text items-center gap-2 rounded-2xl border-1 border-zinc-100 bg-stone-50 px-3 py-1 text-base outline-none",
        className
      )}
      onClick={() => inputRef.current?.focus()}
      type="button"
    >
      {leftIcon}
      <input
        className={cn(
          "w-full outline-none selection:text-slate-50 placeholder:text-[#CACACA] hover:placeholder:text-[#737373] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
        data-slot="input"
        ref={inputRef}
        type={type}
      />
    </button>
  );
}

export { Input };
