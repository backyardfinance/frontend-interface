import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  type VaultHistoryInfoResponse,
  type VaultInfoResponse,
  type VaultInfoStrategyResponse,
  VaultPlatform,
  vaultApi,
} from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "./useSolanaWallet";

const mockData: VaultInfoResponse[] = [
  {
    id: "1",
    name: "USDT",
    token: "USDT",
    platform: VaultPlatform.Jupiter,
    tvl: 12300340,
    apy: 11.9,
    yardReward: 0,
    assetPrice: 0,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
  },
  {
    id: "2",
    name: "HYUSD",
    token: "HYUSD",
    platform: VaultPlatform.Jupiter,
    tvl: 900000,
    apy: 9,
    yardReward: 0,
    assetPrice: 0,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
  },
  {
    id: "3",
    name: "USDC",
    token: "USDC",
    platform: VaultPlatform.Kamino,
    tvl: 10000,
    apy: 11,
    yardReward: 0,
    assetPrice: 0,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
  },
];

type UseVaultsOptions = Omit<UseQueryOptions<VaultInfoResponse[], Error>, "queryKey" | "queryFn">;

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.all,
    queryFn: async () => {
      //TODO
      // const { data } = await vaultApi.vaultControllerGetAllVaults();
      // console.log("vaults", data);
      return mockData;
    },
    ...options,
  });
};

type UseVaultOptions = Omit<UseQueryOptions<VaultInfoStrategyResponse, Error>, "queryKey" | "queryFn">;

export const useVaultByIdWithUser = (vaultId: string, options?: UseVaultOptions) => {
  const { address } = useSolanaWallet();

  return useQuery({
    queryKey: queryKeys.vaults.vaultByIdWithUser(vaultId, address ?? ""),
    queryFn: async () => {
      if (!address) throw Error("useVaultByIdWithUser: address is missing");
      //TODO
      const { data } = await vaultApi.vaultControllerGetVault({ vaultId, userId: address });
      return data;
    },
    ...options,
    enabled: !!vaultId && !!address && options?.enabled,
  });
};

type UseVaultHistoryOptions = Omit<UseQueryOptions<VaultHistoryInfoResponse[], Error>, "queryKey" | "queryFn">;

export const useVaultHistory = (vaultId: string, options?: UseVaultHistoryOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.vaultHistory(vaultId),
    queryFn: async () => {
      const { data } = await vaultApi.vaultControllerGetVaultHistory({ vaultId });
      return data as unknown as VaultHistoryInfoResponse[]; // TODO: remove types
    },
    ...options,
    enabled: !!vaultId && options?.enabled,
  });
};
