import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/common/utils";

const tabsListVariants = cva(
  "z-20 inline-flex h-11 w-fit items-center justify-center gap-2.5 rounded-[100px] p-[3px] text-[#AEB0B1]",
  {
    variants: {
      variant: {
        default: "bg-[#FAFAFA]",
        black: "bg-[#FAFAFA]",
        gray: "bg-neutral-300/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const tabsTriggerVariants = cva(
  "z-20 inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-[100px] px-3.5 py-[11px] font-medium text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-[#AEB0B1] data-[state=active]:text-neutral-800",
        black: "text-[#AEB0B1] data-[state=active]:text-white",
        gray: "text-[#AEB0B1] data-[state=active]:text-neutral-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface TabsContextType {
  variant: VariantProps<typeof tabsListVariants>["variant"];
}

const TabsContext = createContext<TabsContextType>({ variant: "default" });
const useTabsContext = () => useContext(TabsContext);

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root>, VariantProps<typeof tabsListVariants> {}

function Tabs({ className, variant = "default", ...props }: TabsProps) {
  return (
    <TabsContext.Provider value={{ variant }}>
      <TabsPrimitive.Root className={cn("flex flex-col gap-2", className)} data-slot="tabs" {...props} />
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { variant } = useTabsContext();

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const tabsListRef = useRef<HTMLDivElement | null>(null);

  const updateIndicator = useCallback(() => {
    if (!tabsListRef.current) return;
    const activeTab = tabsListRef.current.querySelector<HTMLElement>('[data-state="active"]');
    if (!activeTab) return;

    const activeRect = activeTab.getBoundingClientRect();
    const tabsRect = tabsListRef.current.getBoundingClientRect();

    requestAnimationFrame(() => {
      setIndicatorStyle({
        left: activeRect.left - tabsRect.left,
        top: activeRect.top - tabsRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(updateIndicator, 0);
    window.addEventListener("resize", updateIndicator);
    const observer = new MutationObserver(updateIndicator);

    if (tabsListRef.current) {
      observer.observe(tabsListRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateIndicator);
      observer.disconnect();
    };
  }, [updateIndicator]);

  return (
    <div className="relative" ref={tabsListRef}>
      <TabsPrimitive.List className={cn(tabsListVariants({ variant }), className)} data-slot="tabs-list" {...props} />
      <div
        className={cn(
          "absolute z-10 rounded-[100px] shadow-sm transition-all duration-300 ease-in-out",
          variant === "black" ? "bg-[#383838]" : "bg-white"
        )}
        style={indicatorStyle}
      />
    </div>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { variant } = useTabsContext();

  return (
    <TabsPrimitive.Trigger
      className={cn(tabsTriggerVariants({ variant }), className)}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("flex-1 outline-none", className)} data-slot="tabs-content" {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
