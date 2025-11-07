import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useUsers, useUsersValidateTwitter } from "@/hooks/useUsers";
import { Email } from "./steps/Email";
import { FollowX } from "./steps/FollowX";
import { QuotePost } from "./steps/QuotePost";
import { SignWallet } from "./steps/SignWallet";
import { InfoMessage } from "./steps/ui";

export const WhitelistSteps = () => {
  const { address } = useSolanaWallet();
  const { data: users } = useUsers();
  const user = users?.find((user) => user.wallet === address);
  const { data: validateTwitter } = useUsersValidateTwitter((user as any)?.userId ?? ""); // TODO: remove any

  const isCompletedSignWallet = !!user;
  const isCompletedEmail = !!user?.email;
  const isCompletedFollowX = !!validateTwitter?.subscribed;
  const isCompletedQuotePost = !!validateTwitter?.retweeted;

  const allTaskCompleted = isCompletedSignWallet && isCompletedEmail && isCompletedFollowX && isCompletedQuotePost;

  return (
    <div className="flex flex-col gap-15">
      <div className="flex flex-col gap-5">
        <p className="font-bold text-5xl uppercase leading-[normal]">
          {allTaskCompleted ? "Thank you for early support!" : "Contributor Whitelist"}
        </p>
        {allTaskCompleted ? (
          <InfoMessage message="Mint your Early Contributor NFT badge to be eligible for boosted APY" />
        ) : (
          <p className="font-bold text-[#8D8D8D] text-base leading-[128%]">
            Be the first who farms boosted yield while others chase points
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-5">
        <SignWallet isCompleted={isCompletedSignWallet} />
        <Email disabled={!isCompletedSignWallet} isCompleted={isCompletedEmail} user={user} />
        <FollowX disabled={!isCompletedSignWallet} isCompleted={isCompletedFollowX} />
        <QuotePost disabled={!isCompletedSignWallet || !isCompletedFollowX} isCompleted={isCompletedQuotePost} />
      </div>
    </div>
  );
};
