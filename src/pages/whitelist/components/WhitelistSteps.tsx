import { useWhitelistUser } from "../hooks/useWhitelistUser";
import { Email } from "./steps/Email";
import { FollowX } from "./steps/FollowX";
import { QuotePost } from "./steps/QuotePost";
import { SignWallet } from "./steps/SignWallet";
import { InfoMessage } from "./ui";

export const WhitelistSteps = () => {
  const { tasks, progress, xConnected, user } = useWhitelistUser();

  return (
    <div className="flex flex-col gap-15">
      <div className="flex flex-col gap-5">
        <p className="font-bold text-5xl uppercase leading-[normal]">
          {progress.isComplete ? "Thank you for early support!" : "Contributor Whitelist"}
        </p>
        {progress.isComplete ? (
          <InfoMessage message="Mint your Early Contributor NFT badge to be eligible for boosted APY" />
        ) : (
          <p className="font-bold text-[#8D8D8D] text-base leading-[128%]">
            Be the first who farms boosted yield while others chase points
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-5">
        <SignWallet connectedAddress={user?.wallet} isCompleted={tasks.walletConnected} />
        <Email connectedEmail={user?.email} disabled={!tasks.walletConnected} isCompleted={tasks.emailVerified} />
        <FollowX
          connectedX={user?.twitterUsername}
          disabled={!tasks.walletConnected}
          isCompleted={tasks.xFollowed}
          xConnected={xConnected}
        />
        <QuotePost disabled={!tasks.walletConnected || !tasks.xFollowed} isCompleted={tasks.postRetweeted} />
      </div>
    </div>
  );
};
