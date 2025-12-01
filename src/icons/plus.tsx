import type { Icon } from "./icons";

export const PlusIcon: Icon = ({ className, color = "#979797" }) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.02832 1.16016V6.6875H14.582V7.99707H9.02832V13.5508H7.71875V7.99707H2.19141V6.6875H7.71875V1.16016H9.02832Z"
        fill={color}
        stroke={color}
        strokeWidth="0.308468"
      />
    </svg>
  );
};
