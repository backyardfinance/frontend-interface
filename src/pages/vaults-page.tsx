import { getPlatformImage } from "@/assets/platforms";
import { getTokenImage } from "@/assets/tokens";
import StarsIcon from "@/components/icons/apy-stars.svg?react";
import { PlusIcon } from "@/components/icons/plus";
import { useVaults } from "@/hooks/useVaults";
import { formatNumber } from "@/utils/index";
export default function VaultsPage() {
  const vaults = useVaults();

  const topVaults = vaults?.slice(0, 3);
  if (!vaults) return <div>No vaults found</div>;
  console.log(vaults);
  return (
    <section className="gap-4 py-8 md:py-10">
      <div className="mb-4 flex w-full flex-row items-center justify-center gap-4">
        {topVaults?.map((vault) => {
          return (
            <div
              className="flex grow-1 flex-col gap-4 rounded-2xl rounded-3xl bg-[url('/src/components/icons/card-background.png')] bg-cover bg-stone-50 bg-no-repeat p-4 outline outline-1 outline-zinc-100 outline-offset-[-1px]"
              key={vault.id}
            >
              <div className="flex flex-row items-center justify-center gap-[7px] rounded-2xl bg-white p-[8px] outline outline-1 outline-zinc-100 outline-offset-[-1px]">
                <div className="h-[30px] w-[30px]">
                  {vault.vaultImage ? (
                    <img alt={vault.title} className="h-full w-full rounded-[31px]" src={vault.vaultImage} />
                  ) : (
                    getTokenImage(vault.title)
                  )}
                  <div className="absolute right-0 bottom-0">
                    {vault.platformImage ? (
                      <img alt={vault.platform} className="h-4 w-4 rounded-3xl" src={vault.platformImage} />
                    ) : (
                      getPlatformImage(vault.platform)
                    )}
                  </div>
                </div>
                <div className="flex flex-1 shrink-0 grow-1 flex-col items-start justify-between">
                  <div className="justify-start font-['Product_Sans'] font-bold text-base text-neutral-800 leading-none">
                    {vault.title}
                  </div>
                  <div className="justify-start self-stretch font-['Product_Sans'] font-normal text-xs text-zinc-500 leading-none">
                    {vault.platform}
                  </div>
                </div>
                <div className="flex h-8 w-7 rotate-90 items-center items-center justify-center justify-center rounded-lg bg-stone-50 p-2 outline outline-1 outline-zinc-100 outline-offset-[-1px]">
                  <PlusIcon className="h-5 w-5" />
                </div>
              </div>

              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-1 flex-col items-start justify-between">
                  <div className="justify-start font-['Product_Sans'] font-bold text-base text-neutral-800">
                    {formatNumber(vault.tvl)}
                  </div>
                  <div className="w-14 justify-start font-['Product_Sans'] font-normal text-xs text-zinc-500 uppercase">
                    TVL
                  </div>
                </div>
                <div className="h-6 w-[2px] bg-zinc-200" />
                <div className="flex flex-1 flex-row items-center justify-center">
                  <div className="flex flex-col items-start justify-between">
                    <div className="flex flex-row items-center justify-start font-['Product_Sans'] font-bold text-base text-neutral-800">
                      {vault.apy}%
                      <StarsIcon className="ml-2 h-3.5 w-3.5" />
                    </div>
                    <div className="w-14 justify-start font-['Product_Sans'] font-normal text-xs text-zinc-500 uppercase">
                      APY
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        {vaults.map((vault) => {
          return (
            <div
              className="relative flex min-h-[21px] w-full cursor-pointer flex-row items-center justify-between overflow-hidden rounded-2xl bg-neutral-50 px-[16px] py-[13px] outline outline-1 outline-zinc-300/30 outline-offset-[-1px]"
              data-property-1="Default"
              key={vault.id}
            >
              <div className="inline-flex flex-2 items-center justify-start gap-2">
                <div className="relative flex items-center justify-center">
                  <div className="h-[27px] w-[27px] p-[3px]">
                    {vault.vaultImage ? (
                      <img alt={vault.title} className="h-full w-full rounded-[31px]" src={vault.vaultImage} />
                    ) : (
                      getTokenImage(vault.title)
                    )}
                  </div>
                </div>
                <div className="inline-flex items-start justify-start gap-[0.67px]">
                  <div className="justify-start font-['Product_Sans'] font-bold text-neutral-800 text-xs">
                    {vault.title}
                  </div>
                </div>
              </div>
              <div className="inline-flex flex-2 items-center justify-center gap-2.5">
                <div className="inline-flex items-center justify-start gap-1">
                  {vault.platformImage ? (
                    <img alt={vault.platform} className="h-4 w-4 rounded-3xl" src={vault.platformImage} />
                  ) : (
                    getPlatformImage(vault.platform)
                  )}
                  <div className="justify-start font-['Product_Sans'] font-normal text-neutral-800 text-xs">
                    {vault.platform}
                  </div>
                </div>
              </div>
              <div className="inline-flex flex-2 items-center justify-center gap-1.5">
                <div className="justify-center text-center font-['Product_Sans'] font-bold text-neutral-800 text-xs">
                  {formatNumber(vault.tvl)}
                </div>
              </div>

              <div className="inline-flex flex-2 items-center justify-center gap-0.5">
                <div className="flex flex-row items-center justify-start gap-0.5 font-['Product_Sans'] font-bold text-neutral-800 text-xs">
                  {vault.apy}%
                  <StarsIcon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="inline-flex flex-1 items-center justify-end">
                <PlusIcon className="h-3.5 w-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
