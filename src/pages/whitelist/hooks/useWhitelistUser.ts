import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useUsers, useUsersValidateTwitter } from "@/hooks/useUsers";

interface UseWhitelistUserOptions {
  enabled?: boolean;
}

export const useWhitelistUser = (options?: UseWhitelistUserOptions) => {
  const { address } = useSolanaWallet();
  const { data: users, isLoading: isLoadingUsers } = useUsers({
    enabled: options?.enabled !== false && !!address,
  });

  const user = users?.find((u) => u.wallet === address);

  //TODO: remove any
  const { data: validateTwitter, isLoading: isLoadingTwitter } = useUsersValidateTwitter((user as any)?.userId ?? "", {
    enabled: !!(user as any)?.userId,
  });

  const completionStatus = {
    signWallet: !!user,
    email: !!user?.email,
    followX: !!validateTwitter?.subscribed,
    quotePost: !!validateTwitter?.retweeted,
  };

  const steps = Object.values(completionStatus);
  const allTasksCompleted = steps.every(Boolean);
  const completedCount = steps.filter(Boolean).length;

  return {
    user,
    validateTwitter,
    completionStatus,
    allTasksCompleted,
    completedCount,
    totalSteps: steps.length,
    isLoading: isLoadingUsers || isLoadingTwitter,
  };
};
