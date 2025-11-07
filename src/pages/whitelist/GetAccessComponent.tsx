import { ChevronIcon } from "@/components/icons/chevron";
import { Button } from "../landing/button";

const BENEFITS = [
  "<span>/Early</span> contributor NFT badge",
  "<span>/Boosted APY</span> in the season 1 LP Mining Campaign",
  "<span>/Priority</span> access to launch updates and community events",
];

export const GetAccessComponent = ({ getAccess }: { getAccess: () => void }) => {
  return (
    <div className="flex flex-col gap-[122px]">
      <div className="flex flex-col gap-15">
        <p className="font-bold text-5xl uppercase leading-[normal]">Contributor Whitelist</p>
        <ul className="flex flex-col items-start gap-6 self-stretch">
          {BENEFITS.map((benefit) => (
            <li
              className="font-bold text-[#8D8D8D] leading-[128%] [&_span]:text-[#E3D0FF]"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: explanation
              dangerouslySetInnerHTML={{ __html: benefit }}
              key={benefit}
            />
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-start gap-[21px]">
        <p className="flex items-center justify-center bg-[rgba(227,208,255,0.10)] px-3 py-[13px]">
          <span className="font-bold text-[#E3D0FF] text-sm leading-[128%] tracking-[1.4px]">
            *Claim your Early Contributor NFT to get boosted APY in LP Mining Campaign SEASON 1
          </span>
        </p>
        <Button className="w-full" onClick={getAccess} variant="joinWhitelist">
          Get access <ChevronIcon direction="right" />
        </Button>
      </div>
    </div>
  );
};
