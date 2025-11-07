import { useState } from "react";
import WhitelistBg from "@/assets/landing/whitelist-bg.webp";
import { Header } from "../landing";
import { GetAccessComponent } from "./GetAccessComponent";
import { RightSide } from "./RightSide";
import { WhitelistSteps } from "./WhitelistSteps";

export default function WhitelistPage() {
  const [isGetAccess, setIsGetAccess] = useState(true); //TODO: false

  return (
    <div className="relative z-0 flex min-h-screen flex-col gap-24 px-4 pb-20">
      <div className="noise" />
      <img
        alt="whitelist-bg"
        className="-z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-[45%] left-1/2 h-full w-full object-cover"
        src={WhitelistBg}
      />
      <Header />

      <div className="mx-auto flex w-full max-w-[1350px] justify-between">
        <div className="w-full max-w-[840px]">
          {isGetAccess ? <WhitelistSteps /> : <GetAccessComponent getAccess={() => setIsGetAccess(true)} />}
        </div>
        <RightSide isGetAccess={isGetAccess} />
      </div>
    </div>
  );
}
