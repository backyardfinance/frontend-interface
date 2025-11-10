import { ChevronIcon } from "@/components/icons/chevron";
import { Button } from "@/pages/whitelist/components/ui";
import { WHITELIST_BENEFITS } from "../constants";

export const WhitelistWelcome = ({ onGetAccess }: { onGetAccess: () => void }) => {
  return (
    <div className="flex flex-col gap-16 md:gap-[122px]">
      <div className="flex flex-col gap-8 md:gap-15">
        <p className="font-bold text-3xl uppercase leading-[normal] md:text-4xl lg:text-5xl">Contributor Whitelist</p>
        <ul className="flex flex-col items-start gap-4 self-stretch md:gap-6">
          {WHITELIST_BENEFITS.map((benefit) => (
            <li
              className="font-bold text-[#8D8D8D] text-sm leading-[128%] md:text-base [&_span]:text-[#E3D0FF]"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: explanation
              dangerouslySetInnerHTML={{ __html: benefit }}
              key={benefit}
            />
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-start gap-[21px]">
        <p className="flex items-center justify-center bg-[rgba(227,208,255,0.10)] px-3 py-[13px]">
          <span className="font-bold text-[#E3D0FF] text-xs leading-[128%] tracking-[1.4px] md:text-sm">
            *Claim your Early Contributor NFT to get boosted APY in LP Mining Campaign SEASON 1
          </span>
        </p>
        <Button className="group relative w-full overflow-hidden" onClick={onGetAccess} variant="joinWhitelist">
          <span className="flex items-center justify-center transition-transform duration-300 group-hover:translate-y-[200%]">
            Get access <ChevronIcon className="ml-2" direction="right" />
          </span>
          <span className="absolute inset-0 flex translate-y-[-100%] items-center justify-center transition-transform duration-300 group-hover:translate-y-0">
            Coming soon
          </span>
        </Button>
      </div>
    </div>
  );
};
