import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useWhitelistStatus } from "@/hooks/useWhitelist";

interface UseWhitelistUserOptions {
  enabled?: boolean;
}

export const useWhitelistUser = (options?: UseWhitelistUserOptions) => {
  const { address } = useSolanaWallet();

  const { data: user, isLoading: isLoadingUsers } = useWhitelistStatus({
    enabled: options?.enabled !== false && !!address,
  });

  const tasks = {
    walletConnected: Boolean(user?.tasks.wallet_connected),
    emailVerified: Boolean(user?.tasks.email_verified),
    xFollowed: Boolean(user?.tasks.twitter_followed),
    postRetweeted: Boolean(user?.tasks.post_retweeted),
  };

  const totalTasks = Object.values(tasks);
  const completedTasks = totalTasks.filter(Boolean).length;

  return {
    user,
    xConnected: Boolean(user?.tasks.twitter_linked),
    tasks,
    progress: {
      total: totalTasks.length,
      completed: completedTasks,
      isComplete: completedTasks === totalTasks.length,
    },
    isLoading: isLoadingUsers,
  };
};
