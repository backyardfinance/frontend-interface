import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type CreateStrategyDto,
  type StrategyInfoResponse,
  strategyApi,
  type VaultInfoResponse,
  type VaultInfoStrategyResponse,
} from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "./useSolanaWallet";

type StrategyByIdRequest = {
  strategyId: string;
};

const isSecondStrategyActive = localStorage.getItem("isSecondStrategyActive") || false;

export const mockVaults: Record<string, VaultInfoResponse> = {
  "b74ec1c2-9865-4a78-a44a-28cc2074e4f9": {
    id: "b74ec1c2-9865-4a78-a44a-28cc2074e4f9",
    platform: "Jupiter",
    token: "USDC",
    name: "USDC",
    apy: 7.36,
    tvl: 373984669.0167509,
    assetPrice: 0.999802718275,
    yardReward: 0,
    description:
      "This vault contains USDC, a regulated stablecoin issued by Circle and backed by fully reserved U.S. dollar assets. Known for transparency and strong compliance.",
    publicKey: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  "681fc591-325a-487a-ad55-68fe4e2238c9": {
    id: "681fc591-325a-487a-ad55-68fe4e2238c9",
    platform: "Jupiter",
    token: "USDS",
    name: "USDS",
    apy: 8.44,
    tvl: 21416995.051826198,
    assetPrice: 1.000269049351,
    yardReward: 0,
    description:
      "This vault contains USDS, a synthetic stablecoin issued by Jupiter and backed by fully reserved U.S. dollar assets. Known for transparency and strong compliance.",
    publicKey: "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA",
  },
  "7bcb1eba-0012-44cb-95d6-65964b34b16d": {
    id: "7bcb1eba-0012-44cb-95d6-65964b34b16d",
    platform: "Jupiter",
    token: "USDG",
    name: "USDG",
    apy: 9.95,
    tvl: 36667876.99236106,
    assetPrice: 0.99997765024,
    yardReward: 0,
    description:
      "The USDG Vault holds USDG, a synthetic or protocol-native stablecoin (depending on your platform) pegged to the U.S. dollar and often backed by a basket of crypto collateral.",
    publicKey: "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH",
  },

  "90e71ca5-9bf1-4bd2-a38a-482599fd0b32": {
    id: "90e71ca5-9bf1-4bd2-a38a-482599fd0b32",
    platform: "Kamino",
    token: "USDT",
    name: "Sentora PYUSD",
    apy: 5.23,
    tvl: 170896009.15371403,
    assetPrice: 0.99988338,
    yardReward: 0.03467849415116438,
    description:
      "This vault holds USDT, one of the most widely used stablecoins pegged 1:1 to the U.S. dollar. It offers deep liquidity and broad integration across exchanges and DeFi protocols.",
    publicKey: "A2wsxhA7pF4B2UKVfXocb6TAAP9ipfPJam6oMKgDE5BK",
  },
  "054436d3-721f-4b0c-be32-a63f057e0f68": {
    id: "054436d3-721f-4b0c-be32-a63f057e0f68",
    platform: "Kamino",
    token: "USDT",
    name: "CASH Earn",
    apy: 15.66,
    tvl: 96133795.96936637,
    assetPrice: 1,
    yardReward: 0.019727479575051145,
    description:
      "Represents physical or off-chain cash reserves, held as part of the portfolio’s most liquid and risk-free assets. Used to manage liquidity, hedge volatility, and support operational needs.",
    publicKey: "NSSESC5s9Mk7uhUg7hdRiEeNaz7FQmZveJseF62Zjbc",
  },
  "1c962265-4854-433a-8c38-9ed6497e9b90": {
    id: "1c962265-4854-433a-8c38-9ed6497e9b90",
    platform: "Kamino",
    token: "USDC",
    name: "USDC Prime",
    apy: 8.69,
    tvl: 313664485.22565323,
    assetPrice: 0.99986931,
    yardReward: 0.04318767277022667,
    description:
      "This vault contains USDC, a regulated stablecoin issued by Circle and backed by fully reserved U.S. dollar assets. Known for transparency and strong compliance.",
    publicKey: "HDsayqAsDWy3QvANGqh2yNraqcD8Fnjgh73Mhb3WRS5E",
  },
};

export const mockStrategies: Record<string, StrategyInfoResponse> = {
  "STR-01": {
    strategyName: "STR-01",
    strategyId: "STR-01",
    strategyDepositedAmount: 1004,
    strategyApy: 10,
    strategyTvl: 199.99,
    vaults: [
      {
        token: "USDC",
        id: "b74ec1c2-9865-4a78-a44a-28cc2074e4f9",
        name: "USDC",
        platform: "Jupiter",
        tvl: 373984669.0167509,
        apy: 7.36,
        depositedAmount: 200,
      },
      {
        token: "USDG",
        id: "1c962265-4854-433a-8c38-9ed6497e9b90",
        name: "USDG",
        platform: "Jupiter",
        tvl: 36667876.99236106,
        apy: 9.95,
        depositedAmount: 100,
      },
    ],
  },
  ...(isSecondStrategyActive === "true" && {
    "STR-02": {
      strategyName: "STR-02",
      strategyId: "STR-02",
      strategyDepositedAmount: 1000,
      strategyApy: 9.95,
      strategyTvl: 99.99,
      vaults: [
        {
          token: "USDC",
          id: "b74ec1c2-9865-4a78-a44a-28cc2074e4f9",
          name: "USDC",
          platform: "Jupiter",
          tvl: 373984669.0167509,
          apy: 7.36,
          depositedAmount: 100,
        },
        {
          token: "CASH Earn",
          id: "054436d3-721f-4b0c-be32-a63f057e0f68",
          name: "CASH Earn",
          platform: "Kamino",
          tvl: 96133795.96936637,
          apy: 15.66,
          depositedAmount: 200,
        },
        {
          token: "USDC Prime",
          id: "1c962265-4854-433a-8c38-9ed6497e9b90",
          name: "USDC Prime",
          platform: "Kamino",
          tvl: 313664485.22565323,
          apy: 8.69,
          depositedAmount: 700,
        },
      ],
    },
  }),
};

//str 1 kamin0 usdc -> usdg jupiter weight 80%

export const vaultInfo: Record<string, VaultInfoStrategyResponse> = {
  "b74ec1c2-9865-4a78-a44a-28cc2074e4f9": {
    apy: 7.36,
    assetPrice: 0.999802718275,
    tvl: 373984669.0167509,
    yardReward: 0,
    publicKey: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    id: "b74ec1c2-9865-4a78-a44a-28cc2074e4f9",
    name: "USDC",
    platform: "Jupiter",
    strategies: [
      {
        strategyId: "STR-01",
        strategyName: "STR-01",
        depositedAmount: 200,
        interestEarned: 2.94,
        vaultWeight: isSecondStrategyActive === "true" ? 66.66 : 100,
      },
      ...(isSecondStrategyActive === "true"
        ? [
            {
              strategyId: "STR-02",
              strategyName: "STR-02",
              depositedAmount: 100,
              interestEarned: 0.0,
              vaultWeight: 33.33,
            },
          ]
        : []),
    ],
    myPositionUsd: 0,
    myOwnershipFraction: 0,
  },
  "681fc591-325a-487a-ad55-68fe4e2238c9": {
    apy: 8.44,
    assetPrice: 1.000269049351,
    tvl: 21416995.051826198,
    yardReward: 0,
    publicKey: "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA",
    id: "681fc591-325a-487a-ad55-68fe4e2238c9",
    name: "USDS",
    platform: "Jupiter",
    strategies: [],
    myPositionUsd: 0,
    myOwnershipFraction: 0,
  },
};

type UseStrategyByIdOptions = Omit<UseQueryOptions<StrategyInfoResponse, Error>, "queryKey" | "queryFn">;

export const useStrategyById = ({ strategyId }: StrategyByIdRequest, options?: UseStrategyByIdOptions) => {
  return useQuery({
    queryKey: queryKeys.strategies.strategyByUser(strategyId ?? ""),
    queryFn: async () => {
      if (!strategyId) throw Error("useStrategyById: strategyId is missing");
      // const { data } = await strategyApi.strategyControllerGetStrategy({ strategyId });
      return mockStrategies[strategyId as keyof typeof mockStrategies] as unknown as StrategyInfoResponse; //TODO: remove type
    },
    ...options,
    enabled: !!strategyId && options?.enabled,
  });
};

type UseStrategiesOptions = Omit<UseQueryOptions<StrategyInfoResponse[], Error>, "queryKey" | "queryFn">;

export const useUserStrategies = (options?: UseStrategiesOptions) => {
  const { address } = useSolanaWallet();

  return useQuery({
    queryKey: queryKeys.strategies.strategyByUser(address ?? ""),
    queryFn: async () => {
      if (!address) throw Error("useStrategies: address is missing");
      // const { data } = await strategyApi.strategyControllerGetStrategies({ userId: address });
      return Object.values(mockStrategies) as unknown as StrategyInfoResponse[]; //TODO: remove type
    },
    ...options,
    enabled: !!address && options?.enabled,
  });
};

export const useCreateStrategy = () => {
  //TODO: invalidate query
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStrategyDto) => strategyApi.strategyControllerCreate({ createStrategyDto: data }),
  });
};

export const useDeleteStrategy = () => {
  //TODO: invalidate query
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (strategyId: string) => strategyApi.strategyControllerDeleteStrategy({ strategyId }),
  });
};
