import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { CreateVaultDtoPlatformEnum, type Vault } from "@/api";
// import { vaultApi } from "@/api";;
import { queryKeys } from "@/api/query-keys";

const mockData: Vault[] = [
  {
    id: "1",
    name: "USDT",
    platform: CreateVaultDtoPlatformEnum.JUPITER,
    tvl: 12300340,
    apy: 11.9,
    yard_reward: 0,
    asset_price: 0,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
  },
  {
    id: "2",
    name: "HYUSD",
    platform: CreateVaultDtoPlatformEnum.JUPITER,
    tvl: 900000,
    apy: 9,
    yard_reward: 0,
    asset_price: 0,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
  },
  {
    id: "3",
    name: "USDC",
    platform: CreateVaultDtoPlatformEnum.KAMINO,
    tvl: 10000,
    apy: 11,
    yard_reward: 0,
    asset_price: 0,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
  },
];

type UseVaultsOptions = Omit<UseQueryOptions<Vault[], Error>, "queryKey" | "queryFn">;

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.all,
    queryFn: async () => {
      // const { data } = await vaultApi.vaultControllerGetAllVaults();

      return mockData;
    },
    ...options,
  });
};

type UseVaultOptions = Omit<UseQueryOptions<Vault, Error>, "queryKey" | "queryFn">;

export const useVaultById = (vaultId: string, options?: UseVaultOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.vaultById(vaultId),
    queryFn: async () => {
      // const { data } = await vaultApi.vaultControllerGetStrategies({ vaultId });
      const vault = mockData.find((el) => el.id === vaultId);
      if (!vault) throw Error(`Vault ${vaultId} not found`);
      return vault;
    },
    ...options,
    enabled: !!vaultId && options?.enabled,
  });
};
