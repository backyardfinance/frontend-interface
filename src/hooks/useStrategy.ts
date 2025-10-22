import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type CreateStrategyDto, solanaApi } from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "./useSolanaWallet";

//TODO: add type
type UseStrategiesOptions = Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">;

export const useStrategies = (options?: UseStrategiesOptions) => {
  const { address } = useSolanaWallet();

  return useQuery({
    queryKey: queryKeys.strategies.strategyByUser(address ?? ""),
    queryFn: async () => {
      if (!address) throw Error("useStrategies: address is missing");
      const { data } = await solanaApi.solanaControllerGetStrategies({ userId: address });
      return data;
    },
    ...options,
    enabled: !!address && options?.enabled,
  });
};

export const useCreateStrategy = () => {
  //TODO: invalidate query
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStrategyDto) => solanaApi.solanaControllerCreateStrategy({ createStrategyDto: data }),
  });
};
