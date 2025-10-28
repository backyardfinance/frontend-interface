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

export const mockData: VaultInfoResponse[] = [
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

const fillDescriptions = (data: VaultInfoResponse[]): VaultInfoResponse[] => {
  const descriptions = {
    USDT: "This vault holds USDT, one of the most widely used stablecoins pegged 1:1 to the U.S. dollar. It offers deep liquidity and broad integration across exchanges and DeFi protocols.",
    USDG: "The USDG Vault holds USDG, a synthetic or protocol-native stablecoin (depending on your platform) pegged to the U.S. dollar and often backed by a basket of crypto collateral.",
    USDC: "This vault contains USDC, a regulated stablecoin issued by Circle and backed by fully reserved U.S. dollar assets. Known for transparency and strong compliance.",
    "Sentora PYUSD":
      "This vault stores PYUSD, PayPal’s fully backed and regulated stablecoin. Built on Ethereum, it bridges traditional payment infrastructure with decentralized finance.",
    "CASH Earn":
      "Represents physical or off-chain cash reserves, held as part of the portfolio’s most liquid and risk-free assets. Used to manage liquidity, hedge volatility, and support operational needs.",
  };
  return data.map((vault) => ({
    ...vault,
    description: descriptions[vault.name as keyof typeof descriptions] || "",
  }));
};

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.all,
    queryFn: async () => {
      const { data } = await vaultApi.vaultControllerGetAllVaults();
      const filledData = fillDescriptions(data as unknown as VaultInfoResponse[]);
      return filledData
        .reverse()
        .sort((a, b) => (a.name === "USDC" ? -1 : b.name === "USDC" ? 1 : 0)) as unknown as VaultInfoResponse[]; // TODO: remove types
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
      const { data } = await vaultApi.vaultControllerGetVaultHistory({ vaultId, userId: "" });
      return data as unknown as VaultHistoryInfoResponse[]; // TODO: remove types
    },
    ...options,
    enabled: !!vaultId && options?.enabled,
  });
};
