import type { FC, PropsWithChildren, ReactNode } from "react";
import { cn } from "@/utils";

type CardProps = PropsWithChildren<{
  title?: ReactNode;
  className?: string;
}>;

export const Card: FC<CardProps> = ({ children, title, className }) => {
  return (
    <div
      className={cn(
        "relative flex h-[217px] w-[269px] flex-col items-start justify-between gap-5 bg-[rgba(45,45,45,0.86)] px-[17px] pt-[13px] pb-[21px]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-[12px] w-[12px] border-[#656565] border-t border-l" />
        <div className="absolute top-0 right-0 h-[12px] w-[12px] border-[#656565] border-t border-r" />
        <div className="absolute bottom-0 left-0 h-[12px] w-[12px] border-[#656565] border-b border-l" />
        <div className="absolute right-0 bottom-0 h-[12px] w-[12px] border-[#656565] border-r border-b" />
      </div>

      {title && <div className="w-full font-bold text-xs leading-[128%]">{title}</div>}
      {children}
    </div>
  );
};
