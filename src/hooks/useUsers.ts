import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type CreateUserDto, type SendEmailDto, type UsertInfoResponse, usersApi, type VerifyEmailDto } from "@/api";
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

export const useUsersSendEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendEmailDto) => usersApi.userControllerSendEmail({ sendEmailDto: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useUsersVerifyEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyEmailDto) => usersApi.userControllerVerify({ verifyEmailDto: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};

export const useUsersValidateTwitter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => usersApi.userControllerValidateUser({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
};
