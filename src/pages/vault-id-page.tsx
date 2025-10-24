import { useParams } from "react-router";
import JypiterImage from "@/assets/platforms/Jupyter.svg";
import { getTokenImage } from "@/assets/tokens";
import { ArrowIcon } from "@/components/icons/arrow";
import { InfoCircleIcon } from "@/components/icons/info-circle";
import { StarsIcon } from "@/components/icons/stars";
import { Button } from "@/components/ui/button";
import { CompactHybridTooltip } from "@/components/ui/hybrid-tooltip";
import { Chart } from "@/components/vault/Chart";
import { RecentActivity } from "@/components/vault/RecentActivity";
import { VaultControl } from "@/components/vault/VaultControl";
import { useVaultById } from "@/hooks/useVaults";
import { formatUsdAmount, shortFormIntegerFormatter } from "@/utils";

type Props = {
  title: string;
  value: string;
  valueComponent: React.ReactNode;
  additionalValue?: string;
};

const Item: React.FC<Props> = ({ title, value, additionalValue, valueComponent }) => {
  return (
    <div className="flex flex-col items-start gap-px">
      <p className="font-normal text-[#828282] text-xs capitalize">{title}</p>
      <div className="flex items-center gap-1">
        <p className="font-bold text-lg text-neutral-800 leading-[normal]">{value}</p>
        {valueComponent}
      </div>
      <p className="font-normal text-[#828282] text-[10px] uppercase leading-[normal]">{additionalValue}</p>
    </div>
  );
};

export default function VaultIdPage() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const { data: vault } = useVaultById(vaultId ?? "");
  if (!vaultId || !vault) return <div>No found</div>;

  const data = [
    {
      title: "Total Deposits",
      value: shortFormIntegerFormatter.format(100000000),
      additionalValue: formatUsdAmount(56430000),
      valueComponent: <InfoCircleIcon />,
    },
    {
      title: "My Position",
      value: shortFormIntegerFormatter.format(1000000),
      additionalValue: formatUsdAmount(56430000),
      valueComponent: <StarsIcon color="#2ED650" />,
    },
    {
      title: "APY",
      value: `${10.6}%`,
      valueComponent: <StarsIcon />,
    },
  ];

  const additionalInfo = [
    {
      title: "Performance fee",
      value: "0.00%",
      tooltip: "Performance fee",
    },
    {
      title: "Cooldown",
      value: "4 days",
      tooltip: "Cooldown",
    },
  ];

  return (
    <section className="flex h-full gap-4 py-8 md:py-10">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex h-36 gap-4">
          <div className="relative flex h-full w-48 shrink-0 flex-col justify-between gap-5 rounded-3xl bg-[#FAFAFA] p-3">
            <div className="flex-1" />
            <div className="-translate-x-1/2 -top-12 absolute left-1/2 h-24 w-24">{getTokenImage(vault.name)}</div>
            <p className="flex-1 text-center font-bold text-neutral-800 text-xl">{vault.name}</p>
            <div className="flex flex-1 items-center justify-between gap-1">
              <Button size="sm" variant="white">
                <img alt="Jypiter" className="size-[11px]" src={JypiterImage} />
                Jypiter
                <div className="flex size-[17px] items-center justify-center rounded-[21.5px] bg-[#F8F8F8]">
                  <ArrowIcon className="size-2 rotate-45" />
                </div>
              </Button>
              <Button size="sm" variant="white">
                Contracts
                <div className="flex size-[17px] items-center justify-center rounded-[21.5px] bg-[#F8F8F8]">
                  <ArrowIcon className="size-2" />
                </div>
              </Button>
            </div>
          </div>
          <div className="relative flex h-full w-full flex-col justify-between gap-5 rounded-3xl bg-[#FAFAFA] px-6 py-4.5">
            <p className="font-normal text-[#828282] text-xs">{vault.description}</p>
            <div className="flex justify-between">
              {data.map((el) => (
                <Item key={el.title} {...el} />
              ))}
            </div>
          </div>
        </div>
        <Chart vault={vault} />
        <div className="flex flex-col gap-y-4.5 rounded-[23px] border border-[rgba(214,214,214,0.26)] border-solid bg-[#FAFAFA] px-5.5 py-4.5">
          <p className="font-bold text-[22px] text-neutral-800 leading-[normal]">Additional info</p>
          <div className="flex flex-col gap-2">
            {additionalInfo.map((info) => (
              <div className="flex items-center justify-between" key={info.title}>
                <div className="flex items-center gap-2">
                  <p className="font-normal text-[#646464] text-sm leading-[normal]">{info.title}</p>
                  <CompactHybridTooltip content={info.tooltip}>
                    <InfoCircleIcon />
                  </CompactHybridTooltip>
                </div>
                <p className="font-normal text-neutral-800 text-sm leading-[normal]">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-[396px] flex-col gap-6">
        <VaultControl />
        {/* <div className="h-[485px] rounded-[23px] border-2 border-[#F6F6F6] border-solid bg-[#FAFAFA] px-4 pt-4 pb-6" /> */}
        <RecentActivity />
      </div>
    </section>
  );
}
