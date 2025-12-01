import type { PopoverContentProps, PopoverProps, PopoverTriggerProps } from "@radix-ui/react-popover";
import type { TooltipContentProps, TooltipProps, TooltipTriggerProps } from "@radix-ui/react-tooltip";
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const TouchContext = createContext<boolean | undefined>(undefined);
const useTouch = () => useContext(TouchContext);

const TouchProvider = (props: PropsWithChildren) => {
  const [isTouch, setTouch] = useState<boolean>();

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return <TouchContext.Provider value={isTouch} {...props} />;
};

const HybridTooltip = (props: TooltipProps & PopoverProps) => {
  const isTouch = useTouch();

  return isTouch ? <Popover {...props} /> : <Tooltip {...props} />;
};

const HybridTooltipTrigger = (props: TooltipTriggerProps & PopoverTriggerProps) => {
  const isTouch = useTouch();

  return isTouch ? <PopoverTrigger {...props} /> : <TooltipTrigger {...props} />;
};

const HybridTooltipContent = (props: TooltipContentProps & PopoverContentProps) => {
  const isTouch = useTouch();

  return isTouch ? <PopoverContent {...props} /> : <TooltipContent {...props} />;
};

type CompactHybridTooltipProps = PropsWithChildren & {
  asChild?: boolean;
  content: React.ReactNode;
  align?: "center" | "start" | "end" | undefined;
};

const CompactHybridTooltip = ({ children, asChild, content, align = "center" }: CompactHybridTooltipProps) => {
  return (
    <HybridTooltip>
      <HybridTooltipTrigger asChild={asChild}>{children}</HybridTooltipTrigger>
      <HybridTooltipContent align={align} sideOffset={4}>
        {content}
      </HybridTooltipContent>
    </HybridTooltip>
  );
};

export { CompactHybridTooltip, TouchProvider, HybridTooltip, HybridTooltipTrigger, HybridTooltipContent };
