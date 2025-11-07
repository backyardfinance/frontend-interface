import type { FC, PropsWithChildren, ReactNode } from "react";
import ArcIcon from "@/assets/landing/arc.webp";
import ArcLogoIcon from "@/assets/landing/arc-logo.webp";
import MenIcon from "@/assets/landing/men.webp";
import NFT from "@/assets/landing/nft.webp";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useUsers, useUsersValidateTwitter } from "@/hooks/useUsers";
import { cn } from "@/utils";
import { Button } from "../landing/button";

const Card: FC<PropsWithChildren<{ title?: ReactNode; className?: string }>> = ({ children, title, className }) => {
  return (
    <div
      className={cn(
        "flex h-[217px] w-[269px] flex-col items-start justify-between gap-5 border border-[#656565] border-dashed bg-[rgba(45,45,45,0.86)] px-[17px] pt-[13px] pb-[21px]",
        className
      )}
    >
      {title && <div className="w-full font-bold text-xs leading-[128%]">{title}</div>}
      {children}
    </div>
  );
};

const BENEFITS = [
  "<span>/Early</span> contributor NFT badge",
  "<span>/Boosted APY</span> in the season 1 LP Mining Campaign",
  "<span>/Priority</span> access to launch updates and community events",
];

export const RightSide = ({ isGetAccess }: { isGetAccess: boolean }) => {
  const { address } = useSolanaWallet();
  const { data: users } = useUsers({ enabled: isGetAccess && !!address });
  const user = users?.find((user) => user.wallet === address);
  const { data: validateTwitter } = useUsersValidateTwitter((user as any)?.userId ?? "", { enabled: !!user }); // TODO: remove any

  const steps = [!!user, !!user?.email, !!validateTwitter?.subscribed, !!validateTwitter?.retweeted];

  const allTaskCompleted = steps.filter(Boolean).length === steps.length;

  const whitelistedUsers = 100; //TODO: get from api

  // min -100, max 100
  const fomo = 37; //TODO: get from api, and add color for border

  const minAngle = -100;
  const maxAngle = 100;
  const rotation = minAngle + (fomo / 100) * (maxAngle - minAngle);

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      {allTaskCompleted ? (
        <Card className="h-[263px] w-[269px] p-4">
          <div className="relative size-full overflow-hidden">
            <img alt="nft" className="absolute" src={NFT} />
            <Button
              border="none"
              className="-translate-x-1/2 pointer-events-none absolute bottom-[6px] left-1/2 w-[calc(100%-12px)] bg-[#272727]"
            >
              Mint NFT
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          title={
            <div className="flex w-full items-center justify-between gap-2 font-bold text-xs leading-[128%]">
              <p>Completed tasks</p>
              <p>
                <span className="text-white/10">{steps.filter(Boolean).length}/</span>
                {steps.length}
              </p>
            </div>
          }
        >
          <ul className="flex flex-col gap-4">
            {BENEFITS.map((benefit) => (
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
      <Card title="Whitelisted users">
        <div className="relative">
          <img alt="Men" className="" src={MenIcon} />
          <p className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 font-bold text-[#ABFACA] text-[56px] uppercase leading-[normal]">
            {whitelistedUsers}
          </p>
        </div>
      </Card>
      <Card title="Backyard FOMO">
        <div className="relative flex w-full flex-1 items-center justify-center">
          <div className="absolute top-0 left-0 flex h-[34px] w-[45px] items-center justify-center border border-[rgba(166,248,239,0.21)] border-dashed bg-[rgba(255,255,255,0.03)]">
            <p className="font-bold text-xl leading-[normal]">{fomo}</p>
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
