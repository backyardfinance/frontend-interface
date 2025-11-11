import { useQuery } from "@tanstack/react-query";
import { type GetQuoteDtoTypeEnum, quoteApi, type VaultDepositDto } from "@/api";
import { queryKeys } from "@/api/query-keys";
import { useSolanaWallet } from "./useSolanaWallet";

export const useGetQuote = (type: GetQuoteDtoTypeEnum, deposits: VaultDepositDto[]) => {
  const { address: walletAddress } = useSolanaWallet();
  return useQuery({
    queryKey: queryKeys.quote.quoteDeposit({ walletAddress, type, deposits }),
    queryFn: async () => {
      const internalWalletAddress = walletAddress || "WalletAddress";
      const { data } = await quoteApi.quoteControllerGetQuote({
        getQuoteDto: {
          walletAddress: internalWalletAddress,
          type: type,
          deposits: deposits,
        },
      });
      return data;
    },
    enabled: !!walletAddress && !!type && !!deposits.length,
    retry: false,
  });
};
