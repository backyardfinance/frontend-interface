import type { UseMutationResult, UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import {
  type ApiErrorResponse,
  authApi,
  type SendEmailDto,
  usersApi,
  type VerifyEmailDto,
  type VerifySignatureDto,
  type WhitelistParticipantDto,
  type WhitelistStatusDto,
  whitelistApi,
} from "@/api";
import { queryKeys } from "@/api/query-keys";
import { localStorageService } from "@/services/localStorageService";
import { useSolanaWallet } from "./useSolanaWallet";

type UseWhitelistStatus = Omit<UseQueryOptions<WhitelistStatusDto, Error>, "queryKey" | "queryFn">;

export const useWhitelistStatus = (address?: string, options?: UseWhitelistStatus) => {
  return useQuery({
    queryKey: queryKeys.whitelist.status(address ?? ""),
    queryFn: async () => {
      const { data } = await whitelistApi.whitelistControllerGetWhitelistStatus({ withCredentials: true });
      return data;
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
    ...options,
  });
};

type UseWhitelistParticipants = Omit<UseQueryOptions<WhitelistParticipantDto, Error>, "queryKey" | "queryFn">;

export const useWhitelistParticipants = (options?: UseWhitelistParticipants) => {
  return useQuery({
    queryKey: queryKeys.whitelist.participants,
    queryFn: async () => {
      const { data } = await whitelistApi.whitelistControllerGetAllParticipants();
      return data;
    },
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useWhitelistVerifySignature = (): UseMutationResult<
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

export const useWhitelistSendEmail = (): UseMutationResult<
  AxiosResponse,
  AxiosError<ApiErrorResponse>,
  SendEmailDto,
  unknown
> => {
  return useMutation({
    mutationFn: (data: SendEmailDto) => usersApi.userControllerSendEmail({ sendEmailDto: data }),
  });
};

export const useWhitelistVerifyEmail = (): UseMutationResult<
  AxiosResponse,
  AxiosError<ApiErrorResponse>,
  VerifyEmailDto,
  unknown
> => {
  const queryClient = useQueryClient();
  const { address } = useSolanaWallet();
  return useMutation({
    mutationFn: (data: VerifyEmailDto) => usersApi.userControllerVerify({ verifyEmailDto: data }),
    onSuccess: () => {
      if (!address) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.whitelist.status(address) });
    },
  });
};

export const useWhitelistCheckFollow = () => {
  const queryClient = useQueryClient();
  const { address } = useSolanaWallet();
  return useMutation({
    mutationFn: () => usersApi.userControllerCheckFollow(),
    onSuccess: () => {
      if (!address) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.whitelist.status(address) });
    },
  });
};

export const useWhitelistCheckRetweet = () => {
  const queryClient = useQueryClient();
  const { address } = useSolanaWallet();
  return useMutation({
    mutationFn: () => usersApi.userControllerCheckRetweet(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.whitelist.participants });
      if (!address) return;
      queryClient.invalidateQueries({ queryKey: queryKeys.whitelist.status(address) });
    },
  });
};
