import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { solanaApi } from "@/api";
import { queryKeys } from "@/api/query-keys";

//TODO: add type
type UseVaultsOptions = Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn">;

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: queryKeys.vaults.all,
    queryFn: async () => {
      const { data } = await solanaApi.solanaControllerGetAllVaults();
      return data;
    },
    ...options,
  });
};
