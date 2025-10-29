import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  type VaultHistoryInfoResponse,
  type VaultInfoResponse,
  type VaultInfoStrategyResponse,
  // VaultPlatform,
  vaultApi,
} from "@/api";
import { queryKeys } from "@/api/query-keys";

import { useSolanaWallet } from "./useSolanaWallet";
import { mockVaults, vaultInfo } from "./useStrategy";

type UseVaultsOptions = Omit<UseQueryOptions<VaultInfoResponse[], Error>, "queryKey" | "queryFn">;

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.all,
    queryFn: async () => {
      // const { data } = await vaultApi.vaultControllerGetAllVaults();
      // console.log(data);

      return Object.values(mockVaults);
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
      return vaultInfo[vaultId];
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
      const { data } = await vaultApi.vaultControllerGetVaultHistory({ vaultId, userId: "" });
      return data as unknown as VaultHistoryInfoResponse[]; // TODO: remove types
    },
    ...options,
    enabled: !!vaultId && options?.enabled,
  });
};
