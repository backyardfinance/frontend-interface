import { Popover, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover";
import { cn } from "@/common/utils";
import { SettingsIcon } from "@/icons/settings";

interface SlippageSettingsProps {
  slippage: number;
  onSlippageChange: (slippage: number) => void;
  options?: number[];
}

const DEFAULT_SLIPPAGE_OPTIONS = [0.1, 0.5, 1, 3];

export const SlippageSettings = ({
  slippage,
  onSlippageChange,
  options = DEFAULT_SLIPPAGE_OPTIONS,
}: SlippageSettingsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer rounded-xl border border-zinc-100 bg-white p-1.5">
          <SettingsIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" asChild>
        <div className="flex min-w-[332px] flex-col gap-[16px] rounded-3xl border-2 border-zinc-300/25 bg-white p-[14px]">
          <div className="flex flex-row items-center justify-between font-bold text-base text-neutral-800">
            Slippage
            <span className="font-bold text-sm text-zinc-400">{slippage}%</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            {options.map((option) => (
              <button
                className={cn(
                  "min-w-[50px] cursor-pointer rounded-xl bg-neutral-50 p-[9px] font-bold text-sm text-zinc-400",
                  option === slippage &&
                    "rounded-xl border border-zinc-100 bg-neutral-50 font-bold text-sm text-zinc-800"
                )}
                key={option}
                onClick={() => onSlippageChange(option)}
                type="button"
              >
                {option}%
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
