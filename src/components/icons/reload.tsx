import type { Icon } from "./icons";

export const ReloadIcon: Icon = ({ className, color = "#383838" }) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="11"
      viewBox="0 0 11 11"
      width="11"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.59452 7.59159C7.32048 7.86638 6.99484 8.08429 6.6363 8.2328C6.27776 8.38131 5.8934 8.45748 5.50533 8.45694C3.8736 8.45694 2.55078 7.13412 2.55078 5.5024C2.55078 3.87067 3.8736 2.54785 5.50533 2.54785C6.32111 2.54785 7.05974 2.8786 7.59452 3.4132C7.86666 3.68535 8.45987 4.35341 8.45987 4.35341"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="0.656565"
      />
      <path
        d="M8.45774 2.87793V4.3552H6.98047"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="0.656565"
      />
    </svg>
  );
};
