import { useState } from "react";
import PlusThickIcon from "@/components/icons/plus-thick.svg?react";
import { Input } from "@/components/ui/input";
import { TopVaults } from "@/components/vaults/TopVaults";
import { VaultRow } from "@/components/vaults/VaultRow";
import { useVaults } from "@/hooks/useVaults";
import { cn } from "@/utils";
import type { Strategy, Vault } from "@/utils/types";

export default function VaultsPage() {
  const { data: vaults } = useVaults();
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);

  const topVaults = vaults?.slice(0, 3);
  if (!vaults) return <div>No vaults matching the filters</div>;

  const headers = ["Vault", "Platform", "TVL", "APY", ""];

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>, vault: Vault) => {
    e.stopPropagation();
    setCurrentStrategy((prev) => ({
      vaults: [...(prev?.vaults || []), vault],
      id: prev?.id || "",
      depositAmount: prev?.depositAmount || 0,
      allocation: prev?.allocation || [],
    }));
  };

  return (
    <div className="flex select-none flex-row gap-4">
      <section className="flex-3">
        <TopVaults onAdd={handleAdd} vaults={topVaults} />
        <Input placeholder="Search for vault" />
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <div className="flex w-full px-4">
            {headers.map((header, index) => (
              <div
                className={cn(
                  "flex items-center font-normal text-[#CACACA] text-[9px] leading-[normal]",
                  index === headers.length - 1 ? "min-w-[14px] justify-end" : "flex-2 justify-start"
                )}
                key={header}
              >
                {header}
              </div>
            ))}
          </div>
          <div className="flex w-full flex-col gap-3">
            {vaults.map((vault) => (
              <VaultRow key={vault.id} onAdd={handleAdd} vault={vault} />
            ))}
          </div>
        </div>
      </section>
      <section className="relative flex flex-1 select-none flex-col items-center justify-center rounded-3xl bg-neutral-50">
        {!currentStrategy ? (
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="inline-flex h-12 w-12 rotate-90 items-center justify-center rounded-[64.50px] bg-neutral-200 p-3.5 outline-[0.72px] outline-white">
              <PlusThickIcon className="h-5 w-5" />
            </div>
            <div className="justify-start self-stretch text-center font-['Product_Sans'] font-normal text-neutral-400 text-sm">
              Add vaults from the left to <br />
              build a strategy
            </div>
          </div>
        ) : (
          <div>Strategy setup</div>
        )}
      </section>
    </div>
  );
}
