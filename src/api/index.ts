import type { CreateVaultDtoPlatformEnum } from "./generated";

export * from "./apis";
export * from "./generated";

//TODO: use type from generated
export type Vault = {
  id: string;
  platform: CreateVaultDtoPlatformEnum;
  name: string;
  apy: number;
  tvl: number;
  asset_price: number;
  yard_reward: number;
  description: string;
};
