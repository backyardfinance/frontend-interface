import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { useUsers } from "@/hooks/useUsers";
import { Email } from "./steps/Email";
import { FollowX } from "./steps/FollowX";
import { QuotePost } from "./steps/QuotePost";
import { SignWallet } from "./steps/SignWallet";

export const WhitelistSteps = () => {
  const { address } = useSolanaWallet();
  const { data: users } = useUsers();
  const user = users?.find((user) => user.wallet === address);

  const isCompletedSignWallet = !!user;
  const isCompletedEmail = !!user?.email;
  //TODO: api call
  const isCompletedFollowX = false;

  return (
    <div className="flex flex-col gap-15">
      <div className="flex flex-col gap-5">
        <p className="font-bold text-5xl uppercase leading-[normal]">Contributor Whitelist</p>
        <p className="font-bold text-[#8D8D8D] text-base leading-[128%]">
          Be the first who farms boosted yield while others chase points
        </p>
      </div>
      <div className="flex flex-col items-start gap-5">
        <SignWallet isCompleted={isCompletedSignWallet} />
        <Email disabled={!isCompletedSignWallet} isCompleted={isCompletedEmail} />
        <FollowX disabled={!isCompletedSignWallet} isCompleted={false} />
        <QuotePost disabled={!isCompletedSignWallet || !isCompletedFollowX} isCompleted={false} />
      </div>
    </div>
  );
};
