import { useMutation, useQuery } from "@tanstack/react-query";
import { adminApi, type CreateUserDto } from "@/api";
import { queryKeys } from "@/api/query-keys";

export const useGetUsers = () => {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => adminApi.adminControllerGetUsers(),
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (user: CreateUserDto) => adminApi.adminControllerCreateUser({ createUserDto: user }),
  });
};
