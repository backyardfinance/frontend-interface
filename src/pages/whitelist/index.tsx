import { useState } from "react";
import { Header } from "../landing";
import { GetAccessComponent } from "./GetAccessComponent";
import { RightSide } from "./RightSide";
import { WhitelistSteps } from "./WhitelistSteps";

export default function WhitelistPage() {
  const [isGetAccess, setIsGetAccess] = useState(true); //TODO: false

  return (
    <div className="relative z-0 flex min-h-screen flex-col gap-48 px-4">
      <div className="noise" />
      <Header />

      <div className="mx-auto flex w-full max-w-[1350px] justify-between">
        <div className="w-full max-w-[840px]">
          {isGetAccess ? <WhitelistSteps /> : <GetAccessComponent getAccess={() => setIsGetAccess(true)} />}
        </div>
        <RightSide />
      </div>
    </div>
  );
}
