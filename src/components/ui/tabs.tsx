import * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/index";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("flex flex-col gap-2", className)} data-slot="tabs" {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
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
      <TabsPrimitive.List
        className={cn(
          "z-20 inline-flex h-11 w-fit items-center justify-center gap-2.5 rounded-[100px] bg-[#FAFAFA] p-[3px] text-[#AEB0B1]",
          className
        )}
        data-slot="tabs-list"
        {...props}
      />
      <div
        className="absolute z-10 rounded-[100px] bg-white shadow-sm transition-all duration-300 ease-in-out"
        style={indicatorStyle}
      />
    </div>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "z-20 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[100px] px-3.5 py-[11px] font-medium text-neutral-800 text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("flex-1 outline-none", className)} data-slot="tabs-content" {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
