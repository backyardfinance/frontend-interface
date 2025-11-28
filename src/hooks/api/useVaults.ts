import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { type VaultHistoryInfoResponse, type VaultInfoResponse, type VaultInfoStrategyResponse, vaultApi } from "@/api";
import { queryKeys } from "@/api/query-keys";

type UseVaultsOptions = Omit<UseQueryOptions<VaultInfoResponse[], Error>, "queryKey" | "queryFn">;

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.all,
    queryFn: async () => {
      const { data } = await vaultApi.vaultControllerGetAllVaults();

      return data as unknown as VaultInfoResponse[];
    },
    ...options,
  });
};

type UseVaultOptions = Omit<UseQueryOptions<VaultInfoStrategyResponse, Error>, "queryKey" | "queryFn">;

export const useVaultByIdWithUser = (vaultId: string, options?: UseVaultOptions) => {
  const userId = localStorage.getItem("userId");
  return useQuery({
    queryKey: queryKeys.vaults.vaultByIdWithUser(vaultId, userId ?? ""),
    queryFn: async () => {
      if (!userId) throw Error("useVaultByIdWithUser: address is missing");
      const { data } = await vaultApi.vaultControllerGetVault({ vaultId, walletAddress: userId });
      return data as unknown as VaultInfoStrategyResponse;
    },
    ...options,
    enabled: !!vaultId && !!userId && options?.enabled,
  });
};

type UseVaultHistoryOptions = Omit<UseQueryOptions<VaultHistoryInfoResponse[], Error>, "queryKey" | "queryFn">;

export const useVaultHistory = (vaultId: string, options?: UseVaultHistoryOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.vaultHistory(vaultId),
    queryFn: async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) throw Error("useVaultHistory: userId is missing");
      const { data } = await vaultApi.vaultControllerGetVaultHistory({ vaultId, walletAddress: userId });
      return data as unknown as VaultHistoryInfoResponse[]; // TODO: remove types
    },
    ...options,
    enabled: !!vaultId && options?.enabled,
  });
};
