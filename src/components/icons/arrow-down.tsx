import { useId } from "react";

import type { Icon } from "./icons";

export const ArrowDownIcon: Icon = ({ className }) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="10"
      viewBox="0 0 10 10"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4232_4470)">
        <path d="M9.5 3.06566L8.75 2.39258L5 5.95027L1.25 2.39258L0.5 3.06565L5 7.39258L9.5 3.06566Z" fill="#979797" />
      </g>
      <defs>
        <clipPath id={useId()}>
          <rect fill="white" height="9" transform="translate(9.5 0.392578) rotate(90)" width="9" />
        </clipPath>
      </defs>
    </svg>
  );
};
