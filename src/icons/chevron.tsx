import { cn } from "@/common/utils";
import type { Icon } from "./icons";

const directionClasses: Record<string, string> = {
  up: "rotate-180",
  down: "",
  left: "rotate-90",
  right: "-rotate-90",
};

export const ChevronIcon: Icon = ({ className, color = "#979797", direction = "down" }) => {
  return (
    <svg
      aria-hidden="true"
      className={cn("transition-transform duration-200", directionClasses[direction], className)}
      fill="none"
      height="10"
      viewBox="0 0 10 10"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.4668 3.17308L8.7168 2.5L4.9668 6.05769L1.2168 2.5L0.466797 3.17308L4.9668 7.5L9.4668 3.17308Z"
        fill={color}
      />
    </svg>
  );
};
