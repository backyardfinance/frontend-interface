import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getVaults } from "@/services/mock-data-api";
import type { Vault } from "@/utils/types";

type UseVaultsOptions = Omit<UseQueryOptions<Vault[], Error>, "queryKey" | "queryFn">;

export const useVaults = (options?: UseVaultsOptions) => {
  return useQuery({
    queryKey: ["vaults"],
    queryFn: () => getVaults(),
    ...options,
  });
};
