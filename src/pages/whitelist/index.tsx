import WhitelistBg from "@/assets/landing/whitelist-bg.webp";
import { LandingHeader } from "@/components/header";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useIsMintedNFT } from "@/hooks/useWhitelistNFT";
import { WhitelistStats } from "./components/WhitelistStats";
import { WhitelistSteps } from "./components/WhitelistSteps";
import { WhitelistSuccess } from "./components/WhitelistSuccess";
import { useWhitelistUser } from "./hooks/useWhitelistUser";

export default function WhitelistPage() {
  const { address } = useSolanaWallet();
  const { progress } = useWhitelistUser();
  const { data: isMintedNFT } = useIsMintedNFT(address ?? "");
  const showWhitelistSuccess = progress?.isComplete && isMintedNFT;

  return (
    <div className="relative z-0 flex min-h-screen flex-col gap-12 px-4 pb-20 md:gap-24">
      <div className="noise" />
      <img
        alt="whitelist-bg"
        className="-z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-[45%] left-1/2 h-full w-full object-cover"
        src={WhitelistBg}
      />
      <LandingHeader />

      <div className="mx-auto flex w-full max-w-[1350px] flex-col-reverse gap-14 md:gap-8 lg:flex-row lg:justify-between">
        <div className="w-full lg:max-w-[840px]">
          {showWhitelistSuccess ? <WhitelistSuccess /> : <WhitelistSteps />}
        </div>
        <WhitelistStats />
      </div>
    </div>
  );
}
