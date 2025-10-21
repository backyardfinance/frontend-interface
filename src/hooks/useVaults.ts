import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
// import { getVaults } from "@/services/mock-data-api";
import type { Vault } from "@/utils/types";

type UseVaultsOptions = Omit<UseQueryOptions<Vault[], Error>, "queryKey" | "queryFn">;

const vaults: any[] = [
  {
    id: "1",
    title: "USDT",
    vaultImage: "",
    platform: "Jupyter",
    platformImage: "",
    tvl: 12300340,
    apy: 11.9,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
    contractAddress: "0x0000000000000000000000000000000000000000",
  },
  {
    id: "2",
    title: "USDC",
    vaultImage: "",
    platform: "Synatra",
    platformImage: "",
    tvl: 900000,
    apy: 9,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
    contractAddress: "0x0000000000000000000000000000000000000000",
  },
  {
    id: "3",
    title: "USDT",
    vaultImage: "",
    platform: "Drift",
    platformImage: "",
    tvl: 10000,
    apy: 11,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
    contractAddress: "0x0000000000000000000000000000000000000000",
  },
  {
    id: "4",
    title: "HYUSD",
    vaultImage: "",
    platform: "Hylo",
    platformImage: "",
    tvl: 1000000,
    apy: 12.3,
    description: "USDT is a stablecoin that is pegged to the US dollar.",
    contractAddress: "0x0000000000000000000000000000000000000000",
  },
];

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: ["vaults"],
    queryFn: () => vaults,
    ...options,
  });
};
