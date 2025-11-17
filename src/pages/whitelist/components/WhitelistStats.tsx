import ArcIcon from "@/assets/landing/arc.webp";
import ArcLogoIcon from "@/assets/landing/arc-logo.webp";
import MenIcon from "@/assets/landing/men.webp";
import { useWhitelistParticipants } from "@/hooks/useWhitelist";
import { Button } from "@/pages/whitelist/components/ui";
import { cn, formatWithPrecision } from "@/utils";
import { WHITELIST_BENEFITS } from "../constants";
import { useWhitelistUser } from "../hooks/useWhitelistUser";
import { Card } from "./Card";
import { NftCard } from "./NftCard";

const calculateFomoRotation = (fomo: number): number => {
  const MIN_ANGLE = -100;
  const MAX_ANGLE = 100;
  return MIN_ANGLE + (fomo / 100) * (MAX_ANGLE - MIN_ANGLE);
};

export const WhitelistStats = () => {
  const { progress } = useWhitelistUser();

  const { data: whitelistedUsers } = useWhitelistParticipants();
  console.log('whitelistedUsers', whitelistedUsers);
  const whitelistedUsersCount = whitelistedUsers?.count ?? 0;

  const fomo = (whitelistedUsersCount / 500) * 100;

  const rotation = calculateFomoRotation(fomo);

  return (
    <div className="flex w-full flex-row items-stretch justify-start gap-4 overflow-x-auto pb-4 lg:w-auto lg:flex-col lg:items-start lg:justify-center lg:overflow-x-visible lg:pb-0">
      {progress.isComplete ? (
        <NftCard />
      ) : (
        <Card
          className="h-[263px] flex-shrink-0 lg:h-[217px]"
          title={
            <div className="flex w-full items-center justify-between gap-2 font-bold text-xs leading-[128%]">
              <p>Completed tasks</p>
              <p>
                <span className="text-white/10">{progress.completed}/</span>
                {progress.total}
              </p>
            </div>
          }
        >
          <ul className="flex flex-col gap-4">
            {WHITELIST_BENEFITS.map((benefit) => (
              <li
                className="font-bold text-[#8D8D8D] text-[10px] leading-[128%] [&_span]:text-[#E3D0FF]"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: explanation
                dangerouslySetInnerHTML={{ __html: benefit }}
                key={benefit}
              />
            ))}
          </ul>
          <Button border="none" className="w-full" disabled>
            Mint NFT
          </Button>
        </Card>
      )}
      <Card className="h-[263px] flex-shrink-0 lg:h-[217px]" title="Whitelisted users">
        <div className="relative">
          <img alt="Men" className="" src={MenIcon} />
          <p className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 font-bold text-[#ABFACA] text-[56px] uppercase leading-[normal]">
            {whitelistedUsersCount}
          </p>
        </div>
      </Card>
      <Card className="h-[263px] flex-shrink-0 lg:h-[217px]" title="Backyard FOMO">
        <div className="relative flex w-full flex-1 items-center justify-center">
          <div className="absolute top-0 left-0 flex h-[34px] w-[45px] items-center justify-center border border-[rgba(166,248,239,0.21)] border-dashed bg-[rgba(255,255,255,0.03)]">
            <p className="font-bold text-xl leading-[normal]">{formatWithPrecision(fomo, 1)}</p>
          </div>

          <img
            alt="Arc"
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-[192px]"
            src={ArcIcon}
          />

          <img
            alt="Arc Logo"
            className="-translate-x-1/2 absolute bottom-[15%] left-1/2 z-10 size-10"
            src={ArcLogoIcon}
          />

          <div
            className={cn(
              "-translate-x-1/2 absolute bottom-[40px] left-1/2 origin-bottom transition-transform duration-500 ease-out"
            )}
            style={{
              rotate: `${rotation}deg`,
            }}
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="91"
              viewBox="0 0 10 91"
              width="10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79596 0.25C5.09729 0.250092 5.34539 0.48706 5.35944 0.788086L9.33503 85.9932C9.45589 88.5836 7.38822 90.75 4.79499 90.75C2.20174 90.75 0.134044 88.5836 0.254944 85.9932L4.23248 0.788086C4.24654 0.487001 4.49456 0.25 4.79596 0.25Z"
                fill="#EBEBEB"
                stroke="#D7D7D7"
                strokeWidth="0.5"
              />
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
};
