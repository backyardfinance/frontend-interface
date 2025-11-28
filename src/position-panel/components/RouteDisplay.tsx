import { type ReactNode, useState } from "react";
import { useTimer } from "@/common/hooks/useTimer";
import { ChevronIcon } from "@/icons/chevron";
import { ReloadIcon } from "@/icons/reload";

interface RouteDisplayProps {
  routeSteps?: ReactNode[];
  onRefresh?: () => void;
  timerDuration?: number;
}

export const RouteDisplay = ({ routeSteps, onRefresh, timerDuration = 10 }: RouteDisplayProps) => {
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const { seconds, minutes } = useTimer(timerDuration);

  if (!routeSteps || routeSteps.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <span className="font-bold text-neutral-700 text-xs">Route</span>
          <span className="font-normal text-xs text-zinc-400">{`${minutes}:${seconds}`}</span>
          {onRefresh && (
            <button
              className="cursor-pointer rounded border border-zinc-100 bg-white"
              onClick={onRefresh}
              type="button"
            >
              <ReloadIcon />
            </button>
          )}
        </div>
        <button
          className="cursor-pointer rounded-full border border-zinc-100 bg-white p-2"
          onClick={() => setIsRouteOpen(!isRouteOpen)}
          type="button"
        >
          <ChevronIcon />
        </button>
      </div>
      {isRouteOpen && (
        <div className="mx-[20px] flex flex-col gap-[16px] rounded-3xl border-2 border-zinc-300/25 bg-white p-[13px]">
          <ol className="flex list-inside list-decimal flex-col gap-[7px] font-normal text-xs text-zinc-400">
            {routeSteps.map((step, index) => {
              // biome-ignore lint/suspicious/noArrayIndexKey: explanation
              return <li key={index}>{step}</li>;
            })}
          </ol>
        </div>
      )}
    </>
  );
};
