import EURCIcon from "./eurc.svg?react";
import HYUSDIcon from "./hyusd.svg?react";
import USDCIcon from "./USDC.svg?react";
import USDSIcon from "./usds.svg?react";
import USDTIcon from "./usdt.svg?react";

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
