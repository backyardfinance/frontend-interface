import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { type ApiErrorResponse, authApi, type VerifySignatureDto } from "@/api";
import { queryKeys } from "@/api/query-keys";
import { localStorageService } from "@/common/utils/localStorageService";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";

export const useAuthVerifySignature = (): UseMutationResult<
  AxiosResponse,
  AxiosError<ApiErrorResponse>,
  VerifySignatureDto,
  unknown
> => {
  const queryClient = useQueryClient();
  const { address } = useSolanaWallet();

  return useMutation({
    mutationFn: async (data: VerifySignatureDto) => {
      const response = await authApi.authControllerVerifySignature({ verifySignatureDto: data });
      localStorageService.setTokens(response.data.accessToken, response.data.refreshToken);

      return response;
    },
    onSuccess: () => {
      if (!address) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.whitelist.status(address) });
    },
  });
};
