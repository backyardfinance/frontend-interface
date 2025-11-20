import { useMemo } from "react";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { truncateAddress } from "@/utils";
import { useWhitelistUser } from "../hooks/useWhitelistUser";
import { Email } from "./steps/Email";
import { FollowX } from "./steps/FollowX";
import { MintNFT } from "./steps/MintNFT";
import { QuotePost } from "./steps/QuotePost";
import { SignWallet } from "./steps/SignWallet";
import { ErrorMessage, InfoMessage } from "./ui";

export const WhitelistSteps = () => {
  const { address } = useSolanaWallet();
  const { tasks, progress, xConnected, user } = useWhitelistUser();

  const { isSignWalletCompleted, isEmailCompleted, isFollowXCompleted, isQuotePostCompleted } = useMemo(() => {
    const sign = tasks.walletConnected;
    const email = sign && tasks.emailVerified;
    const follow = email && tasks.xFollowed;
    const quote = follow && tasks.postRetweeted;

    return {
      isSignWalletCompleted: sign,
      isEmailCompleted: email,
      isFollowXCompleted: follow,
      isQuotePostCompleted: quote,
    };
  }, [tasks]);

  const walletMismatch = address !== user?.wallet && user?.wallet;

  return (
    <div className="flex flex-col gap-15">
      <div className="flex flex-col gap-5">
        <p className="font-bold text-5xl uppercase leading-[normal]">Contributor Whitelist</p>
        {progress.isComplete ? (
          <InfoMessage message={"Mint your Early Contributor NFT badge to be eligible for boosted APY"} />
        ) : (
          <p className="font-bold text-[#8D8D8D] text-base leading-[128%]">
            Be the first who farms boosted yield while others chase points
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-5">
        <SignWallet connectedAddress={user?.wallet} isCompleted={isSignWalletCompleted} />
        <Email connectedEmail={user?.email} disabled={!isSignWalletCompleted} isCompleted={isEmailCompleted} />
        <FollowX
          connectedX={user?.twitterUsername}
          disabled={!isEmailCompleted}
          isCompleted={isFollowXCompleted}
          xConnected={xConnected}
        />
        <QuotePost disabled={!isFollowXCompleted} isCompleted={isQuotePostCompleted} />
        <MintNFT connectedAddress={user?.wallet} disabled={!progress.isComplete} />

        {walletMismatch && (
          <ErrorMessage
            message={`Wallet verification failed. Please connect the correct wallet: ${truncateAddress(user.wallet)}`}
          />
        )}

        <p className="flex select-none items-center gap-1 font-bold text-[#E3D0FF] text-s leading-[128%]">
          *If you're facing any issues, DM us on X:
          <a href="https://x.com/backyard_fi" rel="noopener" target="_blank">
            @backyard_fi
          </a>
        </p>
      </div>
    </div>
  );
};
