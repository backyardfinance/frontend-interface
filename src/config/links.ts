import { VaultPlatform } from "@/api";

export const links = {
  x: "https://x.com/backyard_fi",
  x_post: "https://x.com/backyard_fi/status/1990438379855458808",
};

export const PLATFORM_LINKS: Record<VaultPlatform, string> = {
  [VaultPlatform.Jupiter]: "https://jup.ag/lend/earn",
  [VaultPlatform.Kamino]: "https://kamino.com/lend",
};
