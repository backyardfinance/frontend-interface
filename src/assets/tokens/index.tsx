import CASHIcon from "./CASH.png";
import EURCIcon from "./EURC.svg?react";
import HYUSDIcon from "./HYUSD.svg?react";
import PYUSDIcon from "./PYUSD.png";
import USDCIcon from "./USDC.svg?react";
import USDGIcon from "./USDG.svg?react";
import USDSIcon from "./USDS.svg?react";
import USDTIcon from "./USDT.svg?react";

export const getTokenImage = (name: string) => {
  switch (name) {
    case "USDC":
    case "USDC Prime":
      return <USDCIcon className="h-full w-full" />;
    case "EURC":
      return <EURCIcon className="h-full w-full" />;
    case "HYUSD":
      return <HYUSDIcon className="h-full w-full" />;
    case "USDS":
      return <USDSIcon className="h-full w-full" />;
    case "USDT":
      return <USDTIcon className="h-full w-full" />;
    case "USDG":
      return <USDGIcon className="h-full w-full" />;
    case "Sentora PYUSD":
      return <img alt="PYUSD" className="h-full w-full rounded-full" src={PYUSDIcon} />;
    case "CASH Earn":
      return <img alt="CASH" className="h-full w-full rounded-full" src={CASHIcon} />;
  }
};
