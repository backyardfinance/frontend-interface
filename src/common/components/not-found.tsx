import { Link } from "react-router";
import { ArrowIcon } from "@/icons/arrow";
import { APP_ROUTES } from "@/routes";
import { cn } from "../utils";
import { Button } from "./ui/button";

type NotFoundProps = {
  text?: string;
  className?: string;
};

export const NotFound = ({ text = "Not found", className }: NotFoundProps) => {
  return (
    <div className={cn("absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4", className)}>
      <span className="text-neutral-400 text-xl leading-[normal]">{text}</span>
      <Button asChild className="pointer-events-auto" variant="secondary">
        <Link to={APP_ROUTES.VAULTS}>
          <ArrowIcon className="size-3" color="currentColor" direction="left" />
          Back to home
        </Link>
      </Button>
    </div>
  );
};
