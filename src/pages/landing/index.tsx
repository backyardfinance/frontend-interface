import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import BackyardDollarImage from "@/assets/landing/backyard-dollar.webp";
import Coins from "@/assets/landing/bg.webp";
import MobileCoins from "@/assets/landing/mobile-bg.webp";
import YieldEfficientImage from "@/assets/landing/yield-efficient.webp";
import YieldManagerImage from "@/assets/landing/yield-manager.webp";
import { LandingHeader } from "@/components/header";
import { XIcon } from "@/components/icons/x";
import { links } from "@/config/links";
import { APP_ROUTES } from "@/config/routes";
import { Button } from "@/pages/whitelist/components/ui";
import { cn, isDev } from "@/utils";

const WHAT_IS_DATA = [
  {
    color: "text-[#D0E2FF]",
    title: "/Yield Manager",
    description:
      "One-click stablecoin yield aggregation.<br/> Choose multiple stablecoin yield vaults, diversify in seconds, and get better yield without complexity",
  },
  {
    color: "text-[#E3D0FF]",
    title: "/Yield-backed Stablecoin",
    description:
      "Unlock liquidity with BYD.<br/> Mint BYD against your yield-generating LP tokens to stay liquid and productive at the same time",
  },
  {
    color: "text-[#ABFACA]",
    title: "/Boost DeFi Liquidity",
    description:
      "Your liquidity empowers DeFi.<br/> Get veYARD tokens, vote for vaults, earn bribes, and maximize your APY through ve3.3 economy",
  },
];

const HOW_IT_WORKS_DATA = [
  {
    color: "text-[#D0E2FF]",
    listClass: "[&_span]:text-[#D0E2FF]",
    tab: "/Yield Manager/",
    image: YieldManagerImage,
    list: [
      "<span>/flexible</span> allocation across multiple yield vaults",
      "<span>protection from unstable APYs</span> through diversified exposure",
      "<span>one-click</span> deposits and real-time strategy adjustments",
      "<span>boosted yield</span> through auto-compound & ve(3.3) incentives<span>/</span>",
    ],
  },
  {
    color: "text-[#E3D0FF]",
    listClass: "[&_span]:text-[#E3D0FF]",
    tab: "/Yield efficient/",
    image: YieldEfficientImage,
    list: [
      "<span>/weekly</span> YARD emissions go to vaults offering bribes to veYARD holders",
      "<span>veYARD</span> holders earn boosted APY when farming incentivize vaults",
      "<span>stablecoin</span> protocols gain deeper liquidity through targeted incentives",
      "<span>emission</span> flow is governed by users, aligning incentives long-term<span>/</span>",
    ],
  },
  {
    color: "text-[#ABFACA]",
    listClass: "[&_span]:text-[#ABFACA]",
    tab: "/Backyard dollar/",
    image: BackyardDollarImage,
    list: [
      "<span>/minted</span> using Strategy LP tokens as collateral, staying liquid while farming continues",
      "<span>modular</span> risk isolation per vault + unified repayment logic",
      "<span>allows</span> strategy yield to automatically reduce BYD debt over time<span>/</span>",
    ],
  },
];

const HeroSection: FC = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto flex w-full max-w-[1350px] select-none flex-col items-start gap-9.5">
      <div className="flex flex-col items-start gap-4.5">
        <p className="font-bold text-[48px] uppercase leading-[116%] md:text-[76px]">{`//SAME FLOW BETTER APy/`}</p>
        <p className="font-bold text-[#898989] text-xl leading-[128%]">
          Self-curated stablecoin yield infrastructure on Solana
        </p>
      </div>
      <div className="flex w-full flex-col items-start gap-4.5 md:w-[564px] md:flex-row">
        {isDev() ? <Button
          className="h-[56px] w-full text-base"
          onClick={() => navigate(APP_ROUTES.WHITELIST)}
          variant="joinWhitelist"
        >
          Join whitelist
        </Button>:<Button
          className="group relative h-[56px] w-full overflow-hidden text-base"
          variant="joinWhitelist"
        >
          <span className="flex items-center justify-center transition-transform duration-300 group-hover:translate-y-[200%]">
              Join whitelist
            </span>
            <span className="absolute inset-0 flex translate-y-[-100%] items-center justify-center transition-transform duration-300 group-hover:translate-y-0">
              Coming soon
            </span>
          </Button>}
        <Button
          className="h-[56px] w-full text-base"
          hover="green"
          onClick={() => window.open("https://backyard-fi.gitbook.io/backyard-finance")}
          variant="readDocs"
        >
          / Read docs /
        </Button>
      </div>
    </section>
  );
};

const WhatIsBackyardSection: FC = () => {
  return (
    <section className="mx-auto flex w-full max-w-[1350px] flex-col items-start gap-8 md:gap-21">
      <p className="font-bold text-[28px] uppercase leading-[116%] md:text-[56px]">What is Backyard?</p>
      <div className="grid gap-[11px] max-md:grid-rows-3 md:grid-cols-3 md:gap-[37px]">
        {WHAT_IS_DATA.map(({ title, description, color }) => (
          <div
            className="flex select-none flex-col items-start gap-[19px] border border-white/15 border-dashed px-5 py-[23px] [background:rgba(171,171,171,0.07)] md:gap-7 md:p-[31px]"
            key={title}
          >
            <p className={cn("font-bold text-base leading-[128%] md:text-[20px]", color)}>{title}</p>
            <p
              className="font-bold text-[#898989] text-sm leading-[128%] md:text-base"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: explanation
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

const HowItWorksSection: FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section className="mx-auto flex w-full max-w-[1350px] flex-col items-start gap-[23px] md:gap-[49px]">
      <div className="flex flex-col items-start gap-[23px] self-stretch md:gap-[38px]">
        <p className="font-bold text-[28px] uppercase leading-[116%] md:text-[56px]">How it works</p>
        <div className="flex flex-wrap items-center gap-[18px] md:gap-[30px]">
          {HOW_IT_WORKS_DATA.map(({ tab }, index) => (
            <button
              className={cn(
                "cursor-pointer font-bold text-[14px] text-white/36 leading-[128%] transition-all duration-300 hover:opacity-100 active:opacity-15 md:text-2xl",
                activeTab === index ? HOW_IT_WORKS_DATA[index].color : "opacity-30"
              )}
              key={tab}
              onClick={() => setActiveTab(index)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between lg:flex-row">
        <ul className="flex h-full w-full flex-col justify-between gap-[22px] border-[0.803px] border-white/15 border-dashed bg-[rgba(171,171,171,0.07)] px-5 py-[29px] md:max-w-[462px] md:p-[31px]">
          {HOW_IT_WORKS_DATA[activeTab].list.map((item) => (
            <li
              className={cn(
                "font-bold text-[#898989] text-sm leading-[128%] md:text-[17px]",
                HOW_IT_WORKS_DATA[activeTab].listClass
              )}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: explanation
              dangerouslySetInnerHTML={{ __html: item }}
              key={item}
            />
          ))}
        </ul>

        <img alt="how it works" className="mt-[23px] max-h-[304px] md:mt-0" src={HOW_IT_WORKS_DATA[activeTab].image} />
      </div>
    </section>
  );
};

const CTASection: FC = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto flex w-full max-w-[1350px] flex-col items-start gap-9.5">
      <div className="flex flex-col items-start gap-4.5">
        <p className="mt-[100px] font-bold text-[48px] uppercase leading-[116%] md:mt-0 md:text-[76px]">{`//Real yield starts early/`}</p>
        <p className="font-bold text-[#898989] text-xl leading-[128%]">
          Self-curated stablecoin yield infrastructure on Solana
        </p>
      </div>
      <div className="flex w-full flex-col items-start gap-4.5 md:w-[564px] md:flex-row">
        <Button className="w-full" onClick={() => navigate(APP_ROUTES.WHITELIST)} variant="joinWhitelist">
          Join whitelist
        </Button>
        <Button
          className="w-full"
          hover="green"
          onClick={() => window.open("https://backyard-fi.gitbook.io/backyard-finance")}
          variant="readDocs"
        >
          / Read docs /
        </Button>
      </div>
    </section>
  );
};

const Footer: FC = () => {
  return (
    <footer className="mx-auto mb-16 flex w-full max-w-[1350px] items-center justify-between gap-4.5 md:justify-end">
      <p>© {new Date().getUTCFullYear()} Backyard</p>
      <Button asChild hover="green">
        <a href={links.x} rel="noopener" target="_blank">
          <XIcon className="h-[14px] w-[15px]" />
        </a>
      </Button>
    </footer>
  );
};

export default function IndexPage() {
  return (
    <div className="relative z-0 flex flex-col gap-[166px] overflow-hidden px-4 md:gap-[380px] md:px-20">
      <div className="noise" />
      <img
        alt="coins"
        className="-z-10 -translate-x-1/2 -top-[300px] pointer-events-none absolute left-1/2 hidden h-full max-w-none object-cover md:block"
        src={Coins}
      />
      <img
        alt="mobile-coins"
        className="-z-10 -left-18 -top-14 pointer-events-none absolute h-full max-w-none object-cover md:hidden"
        src={MobileCoins}
      />
      <div className="flex flex-col gap-[104px] md:gap-[175px]">
        <LandingHeader />
        <HeroSection />
      </div>
      <WhatIsBackyardSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
