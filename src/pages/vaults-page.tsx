import { TopVault } from "@/components/vaults/TopVault";
import { VaultRow } from "@/components/vaults/VaultRow";
import { useVaults } from "@/hooks/useVaults";

export default function VaultsPage() {
  const { data: vaults } = useVaults();

  const topVaults = vaults?.slice(0, 3);
  if (!vaults) return <div>No vaults matching the filters</div>;
  console.log(vaults);
  return (
    <section className="gap-4 py-8 md:py-10">
      <div className="mb-4 flex w-full flex-row items-center justify-center gap-4">
        {topVaults?.map((vault) => (
          <TopVault key={vault.id} vault={vault} />
        ))}
      </div>
      <div className="flex flex-col items-center justify-center gap-1.5">
        {vaults.map((vault) => (
          <VaultRow key={vault.id} vault={vault} />
        ))}
      </div>
    </section>
  );
}
