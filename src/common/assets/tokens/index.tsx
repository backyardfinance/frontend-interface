import USDCIcon from "./usdc.png";
import USDTIcon from "./usdt.png";

export const getTokenImage = (symbol: string) => {
  switch (symbol) {
    case "USDC":
      return <img alt="USDC" className="h-full w-full rounded-full" src={USDCIcon} />;
    case "USDT":
      return <img alt="USDT" className="h-full w-full rounded-full" src={USDTIcon} />;
  }
};

export const getVaultTokenImage = (publicKey: string) => {
  switch (publicKey) {
    case "FMpzkDYEp8p6rtiMFWzUoZhvLz3ULmr5tbX19vwi1tg2":
      return <img alt="USDC" className="h-full w-full rounded-full" src={USDCIcon} />;
    case "4qhknznvANBs44es7iTU3iGr5LuDojW3EKZacr2X65ZQ":
      return <img alt="USDT" className="h-full w-full rounded-full" src={USDTIcon} />;
  }
};
