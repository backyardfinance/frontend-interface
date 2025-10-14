import type * as React from "react";

import { cn } from "@/utils/index";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-9 w-full min-w-0 rounded-2xl border-1 border-zinc-100 bg-stone-50 px-3 py-1 text-base outline-none transition-[color,box-shadow] selection:bg-slate-900 selection:text-slate-50 placeholder:text-slate-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-slate-200/30 dark:dark:bg-slate-800/30 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-500/40 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
