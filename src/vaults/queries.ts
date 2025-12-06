import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { type VaultHistoryInfoResponse, type VaultInfoResponse, type VaultInfoStrategyResponse, vaultApi } from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";

type UseVaultsOptions = Omit<UseQueryOptions<VaultInfoResponse[], Error>, "queryKey" | "queryFn">;

//TEMP FIX: remove this when the API is updated

// const vaultIdToMint = {
//   ["20bcbb4b-6db6-423c-bdd1-26c9b8fad24d"]: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//   ["46a5e9d6-2d3f-488b-b913-fd87aa4d319c"]: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
// };

// export const vaultIdToLp = {
//   ["20bcbb4b-6db6-423c-bdd1-26c9b8fad24d"]: "CcHiq8Z7iweXrXXcfrh66n8ugghDjggfsunBdm8MDaiJ",
//   ["46a5e9d6-2d3f-488b-b913-fd87aa4d319c"]: "9MHGzf767LATMwWrHKV1cXpo59phHgPTYKaDoibJPCtK",
// };

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.all,
    queryFn: async () => {
      const { data } = await vaultApi.vaultControllerGetAllVaults();

      // const updatedVaults = data.map((vault) => {
      //   return {
      //     ...vault,
      //     inputTokenMint: vaultIdToMint[vault.id as keyof typeof vaultIdToMint],
      //   };
      // });

      return data;
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
      const { data } = await vaultApi.vaultControllerGetVault({ vaultId, walletAddress: address });

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
      const userId = localStorage.getItem("userId");
      if (!userId) throw Error("useVaultHistory: userId is missing");
      const { data } = await vaultApi.vaultControllerGetVaultHistory({ vaultId, walletAddress: userId });
      return data;
    },
    ...options,
    enabled: !!vaultId && options?.enabled,
  });
};
