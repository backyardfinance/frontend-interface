import type { UseMutationResult, UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import {
  type ApiErrorResponse,
  type CreateUserDto,
  type SendEmailDto,
  type TwitterVerifyDto,
  type UsertInfoResponse,
  usersApi,
  type VerifyEmailDto,
} from "@/api";
import { queryKeys } from "@/api/query-keys";

type UseUserOptions = Omit<UseQueryOptions<UsertInfoResponse[], Error>, "queryKey" | "queryFn">;

export const useUsers = (options?: UseUserOptions) => {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const { data } = await usersApi.userControllerGetUsers();
      return data;
    },
    ...options,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDto) => usersApi.userControllerCreateUser({ createUserDto: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useUsersSendEmail = (): UseMutationResult<
  AxiosResponse,
  AxiosError<ApiErrorResponse>,
  SendEmailDto,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendEmailDto) => usersApi.userControllerSendEmail({ sendEmailDto: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useUsersVerifyEmail = (): UseMutationResult<
  AxiosResponse,
  AxiosError<ApiErrorResponse>,
  VerifyEmailDto,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyEmailDto) => usersApi.userControllerVerify({ verifyEmailDto: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

type UseUserValidateTwitterOptions = Omit<UseQueryOptions<TwitterVerifyDto, Error>, "queryKey" | "queryFn">;

export const useUsersValidateTwitter = (userId: string, options?: UseUserValidateTwitterOptions) => {
  return useQuery({
    queryKey: queryKeys.users.validateTwitter(userId),
    queryFn: async () => {
      const { data } = await usersApi.userControllerValidateUser({ userId });
      return data;
    },
    ...options,
    enabled: !!userId && options?.enabled,
  });
};
