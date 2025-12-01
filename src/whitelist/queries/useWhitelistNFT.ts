import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api";
import { queryKeys } from "@/api/query-keys";

export const useIsMintedNFT = (address: string) => {
  return useQuery({
    queryKey: queryKeys.whitelist.isMintedNFT(address),
    queryFn: async () => {
      const { data } = await usersApi.userControllerCheckUserHasNFT({ walletAddress: address });
      return data;
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
  });
};
