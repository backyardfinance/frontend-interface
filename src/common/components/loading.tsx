import Logo from "@/icons/backyard-logo.svg";
import { cn } from "../utils";

type LoadingProps = {
  className?: string;
};

/**
 * Loading component on full page (position: absolute)
 */
export const Loading = ({ className }: LoadingProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2",
        className
      )}
    >
      <img alt="backyard" className="size-10 animate-pulse" src={Logo} />
      <span className="text-base text-neutral-800 leading-normal">Loading...</span>
    </div>
  );
};
