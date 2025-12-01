import { VaultPlatform } from "@/api";
import JupiterIcon from "./jupiter.webp";
import KaminoIcon from "./kamino.webp";

export const getPlatformImage = (platform: string) => {
  switch (platform) {
    case VaultPlatform.Jupiter:
      return <img alt={JupiterIcon} className="h-full w-full rounded-full" src={JupiterIcon} />;
    case VaultPlatform.Kamino:
      return <img alt={KaminoIcon} className="h-full w-full rounded-full" src={KaminoIcon} />;
  }
};
