import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { type VaultHistoryInfoResponse, type VaultInfoResponse, type VaultInfoStrategyResponse, vaultApi } from "@/api";
import { queryKeys } from "@/api/query-keys";

type UseVaultsOptions = Omit<UseQueryOptions<VaultInfoResponse[], Error>, "queryKey" | "queryFn">;

//TEMP FIX: remove this when the API is updated

const vaultIdToMint = {
  ["20bcbb4b-6db6-423c-bdd1-26c9b8fad24d"]: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  ["02cea256-d3f2-45ed-a750-6cd9e0e6a83b"]: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
};

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.all,
    queryFn: async () => {
      const { data } = await vaultApi.vaultControllerGetAllVaults();

      const updatedVaults = data.map((vault): VaultInfoResponse => {
        return {
          ...vault,
          inputTokenMint: vaultIdToMint[vault.id as keyof typeof vaultIdToMint],
        } as unknown as VaultInfoResponse;
      });

      return updatedVaults as unknown as VaultInfoResponse[];
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
