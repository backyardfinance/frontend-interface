import PlusThickIcon from "@/components/icons/plus-thick.svg?react";
import { TopVault } from "@/components/vaults/TopVault";
import { VaultRow } from "@/components/vaults/VaultRow";
import { useVaults } from "@/hooks/useVaults";

export default function VaultsPage() {
  const { data: vaults } = useVaults();

  const topVaults = vaults?.slice(0, 3);
  if (!vaults) return <div>No vaults matching the filters</div>;

  return (
    <div className="flex select-none flex-row gap-4">
      <section className="flex-3">
        <div className="mb-4 flex w-full flex-row items-center justify-center gap-4">
          {topVaults?.map((vault) => (
            <TopVault key={vault.id} vault={vault} />
          ))}
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          {vaults.map((vault) => (
            <VaultRow key={vault.id} vault={vault} />
          ))}
        </div>
      </section>
      <section className="relative flex flex-1 select-none flex-col items-center justify-center rounded-3xl bg-neutral-50">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="inline-flex h-12 w-12 rotate-90 items-center justify-center rounded-[64.50px] bg-neutral-200 p-3.5 outline outline-[0.72px] outline-white">
            <PlusThickIcon className="h-5 w-5" />
          </div>
          <div className="justify-start self-stretch text-center font-['Product_Sans'] font-normal text-neutral-400 text-sm">
            Add vaults from the left to <br />
            build a strategy
          </div>
        </div>
      </section>
    </div>
  );
}
