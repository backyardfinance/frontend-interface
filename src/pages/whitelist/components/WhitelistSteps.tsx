// import { useWhitelistUser } from "../hooks/useWhitelistUser";
// import { Email } from "./steps/Email";
// import { FollowX } from "./steps/FollowX";
// import { QuotePost } from "./steps/QuotePost";
// import { SignWallet } from "./steps/SignWallet";
import { StepWrapper } from "./ui";

const steps = ["Sign wallet", "Email", "Follow X", "Quote post"];

export const WhitelistSteps = () => {
  // const { user, completionStatus, allTasksCompleted } = useWhitelistUser();

  return (
    <div className="flex flex-col gap-15">
      <div className="flex flex-col gap-5">
        <p className="font-bold text-5xl uppercase leading-[normal]">
          {/* {allTasksCompleted
            ? "Thank you for early support!"
            :  */}
          Contributor Whitelist
          {/* } */}
        </p>
        {/* {allTasksCompleted ? (
          <InfoMessage message="Mint your Early Contributor NFT badge to be eligible for boosted APY" />
        ) : ( */}
        <p className="font-bold text-[#8D8D8D] text-base leading-[128%]">
          Be the first who farms boosted yield while others chase points
        </p>
        {/* )} */}
      </div>
      <div className="flex flex-col items-start gap-5">
        {steps.map((step) => (
          <StepWrapper className="group relative flex-col overflow-hidden" key={step}>
            <div className="flex w-full grow items-center justify-between gap-4">
              <p className="relative w-full font-bold text-sm text-white leading-[normal]">
                <span className="block transition-transform duration-300 group-hover:translate-y-[200%]">/{step}</span>
                <span className="absolute inset-0 flex w-full translate-y-[-300%] items-center transition-transform duration-300 group-hover:translate-y-0">
                  Coming soon
                </span>
              </p>
            </div>
          </StepWrapper>
        ))}
        {/* <SignWallet isCompleted={completionStatus.signWallet} />
        <Email disabled={!completionStatus.signWallet} isCompleted={completionStatus.email} user={user} />
        <FollowX disabled={!completionStatus.signWallet} isCompleted={completionStatus.followX} />
        <QuotePost
          disabled={!completionStatus.signWallet || !completionStatus.followX}
          isCompleted={completionStatus.quotePost}
        /> */}
      </div>
    </div>
  );
};
