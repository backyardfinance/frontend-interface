import type { Icon } from "./icons";

export const XIcon: Icon = ({ className, color = "currentColor" }) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="15"
      viewBox="0 0 15 15"
      width="15"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.813 0H14.113L9.088 5.958L15 14.063H10.372L6.746 9.146L2.598 14.063H0.296L5.671 7.691L0 0H4.747L8.023 4.495L11.813 0ZM11.006 12.635H12.281L4.053 1.353H2.686L11.006 12.635Z"
        fill={color}
      />
    </svg>
  );
};
