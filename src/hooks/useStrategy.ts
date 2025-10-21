import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import Hylo from "@/assets/platforms/Hylo.svg";
import Jupyter from "@/assets/platforms/Jupyter.svg";
import Synatra from "@/assets/platforms/Synatra.svg";

const strategies = [
  {
    strategy: "SRT-001",
    creator: {
      name: "Hylo",
      icon: Hylo,
    },
    allocation: [
      {
        weight: "10",
        amount: "100",
        token: "USDC",
      },
      {
        weight: "90",
        amount: "300",
        token: "USDC",
      },
    ],
    myPosition: "$123,982.00",
    apy: "10.6",
  },
  {
    strategy: "SRT-002",
    creator: {
      name: "Jupiter",
      icon: Jupyter,
    },
    allocation: [
      {
        weight: "10",
        amount: "100",
        token: "USDC",
      },
      {
        weight: "90",
        amount: "300",
        token: "USDC",
      },
    ],
    myPosition: "$123,982.00",
    apy: "10.6",
  },
  {
    strategy: "SRT-003",
    creator: {
      name: "Synatra",
      icon: Synatra,
    },
    allocation: [
      {
        weight: "10",
        amount: "100",
        token: "USDC",
      },
      {
        weight: "90",
        amount: "300",
        token: "USDC",
      },
    ],
    myPosition: "$123,982.00",
    apy: "10.6",
  },
];

export type Strategy = (typeof strategies)[number];

type UseStrategiesOptions = Omit<UseQueryOptions<Strategy[], Error>, "queryKey" | "queryFn">;

export const useStrategies = (options?: UseStrategiesOptions) => {
  return useQuery({
    queryKey: ["strategies"],
    queryFn: () => strategies,
    ...options,
  });
};
