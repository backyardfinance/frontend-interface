import { cn } from "@/common/utils";
import type { Icon } from "./icons";

const directionClasses: Record<string, string> = {
  up: "rotate-180",
  down: "",
  left: "-rotate-90",
  right: "rotate-90",
};

export const ArrowIcon: Icon = ({ className, color = "#B1B1B1", direction = "up" }) => {
  return (
    <svg
      aria-hidden="true"
      className={cn("transition-transform duration-200", directionClasses[direction], className)}
      fill="none"
      height="9"
      viewBox="0 0 8 9"
      width="8"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 8C4.5 8.27614 4.27614 8.5 4 8.5C3.72386 8.5 3.5 8.27614 3.5 8L4 8L4.5 8ZM3.64645 0.646447C3.84171 0.451184 4.15829 0.451184 4.35355 0.646447L7.53553 3.82843C7.7308 4.02369 7.7308 4.34027 7.53553 4.53553C7.34027 4.7308 7.02369 4.7308 6.82843 4.53553L4 1.70711L1.17157 4.53553C0.976311 4.7308 0.659728 4.7308 0.464466 4.53553C0.269204 4.34027 0.269204 4.02369 0.464466 3.82843L3.64645 0.646447ZM4 8L3.5 8L3.5 1L4 1L4.5 1L4.5 8L4 8Z"
        fill={color}
      />
    </svg>
  );
};
