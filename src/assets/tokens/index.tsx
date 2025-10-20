import EURCIcon from "./EURC.svg?react";
import HYUSDIcon from "./HYUSD.svg?react";
import USDCIcon from "./USDC.svg?react";
import USDSIcon from "./USDS.svg?react";
import USDTIcon from "./USDT.svg?react";

export const getTokenImage = (name: string) => {
  switch (name) {
    case "USDC":
      return <USDCIcon className="h-full w-full" />;
    case "EURC":
      return <EURCIcon className="h-full w-full" />;
    case "HYUSD":
      return <HYUSDIcon className="h-full w-full" />;
    case "USDS":
      return <USDSIcon className="h-full w-full" />;
    case "USDT":
      return <USDTIcon className="h-full w-full" />;
  }
};
