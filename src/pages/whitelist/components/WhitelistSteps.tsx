import { useWhitelistUser } from "../hooks/useWhitelistUser";
import { Email } from "./steps/Email";
import { FollowX } from "./steps/FollowX";
import { QuotePost } from "./steps/QuotePost";
import { SignWallet } from "./steps/SignWallet";
import { InfoMessage } from "./ui";

export const WhitelistSteps = () => {
  const { user, completionStatus, allTasksCompleted } = useWhitelistUser();

  return (
    <div className="flex flex-col gap-8 md:gap-15">
      <div className="flex flex-col gap-3 md:gap-5">
        <p className="font-bold text-3xl uppercase leading-[normal] md:text-4xl lg:text-5xl">
          {allTasksCompleted ? "Thank you for early support!" : "Contributor Whitelist"}
        </p>
        {allTasksCompleted ? (
          <InfoMessage message="Mint your Early Contributor NFT badge to be eligible for boosted APY" />
        ) : (
          <p className="font-bold text-[#8D8D8D] text-sm leading-[128%] md:text-base">
            Be the first who farms boosted yield while others chase points
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-3 md:gap-5">
        <SignWallet isCompleted={completionStatus.signWallet} />
        <Email disabled={!completionStatus.signWallet} isCompleted={completionStatus.email} user={user} />
        <FollowX disabled={!completionStatus.signWallet} isCompleted={completionStatus.followX} />
        <QuotePost
          disabled={!completionStatus.signWallet || !completionStatus.followX}
          isCompleted={completionStatus.quotePost}
        />
      </div>
    </div>
  );
};
