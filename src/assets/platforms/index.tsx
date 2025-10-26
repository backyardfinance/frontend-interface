import { VaultPlatform } from "@/api";
// import DriftIcon from "./Drift.svg?react";
// import HyloIcon from "./Hylo.svg?react";
import JupyterIcon from "./Jupyter.svg?react";
// import SynatraIcon from "./Synatra.svg?react";

export const getPlatformImage = (platform: VaultPlatform) => {
  switch (platform) {
    // case "Drift":
    //   return <DriftIcon className="h-full w-full" />;
    // case "Hylo":
    // return <HyloIcon className="h-full w-full" />;
    case VaultPlatform.Jupiter:
      return <JupyterIcon className="h-full w-full" />;
    case VaultPlatform.Kamino:
      return (
        <img
          alt="Kamino"
          className="h-full w-full"
          src="https://docs.kamino.finance/~gitbook/image?url=https%3A%2F%2F741543836-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FDGxGrFuaWUFzMv9IjZMP%252Ficon%252FAkQpadHH8WGKd86ZtmOC%252FKMNO%2520Token%2520PNG.png%3Falt%3Dmedia%26token%3D64074a90-31e0-46ce-955c-ecb484344fa2&width=32&dpr=2&quality=100&sign=7ffe783c&sv=2"
        />
      );
    // case "Synatra":
    //   return <SynatraIcon className="h-full w-full" />;
  }
};
