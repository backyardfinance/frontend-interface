import { useWhitelistUser } from "@/whitelist/hooks/useWhitelistUser";

export const WhitelistSuccess = () => {
  const { user } = useWhitelistUser();
  const email = user?.email;

  return (
    <div className="flex flex-col gap-15">
      <div className="flex flex-col gap-5">
        <p className="font-bold text-3xl uppercase leading-[normal] md:text-5xl">Thank you for early support!</p>
      </div>
      <div className="relative flex flex-col items-start justify-between gap-[76px] bg-[rgba(45,45,45,0.86)] p-4 md:p-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 h-5 w-7 border-[#656565] border-t border-l md:h-10 md:w-14" />
          <div className="absolute top-0 right-0 h-5 w-7 border-[#656565] border-t border-r md:h-10 md:w-14" />
          <div className="absolute bottom-0 left-0 h-5 w-7 border-[#656565] border-b border-l md:h-10 md:w-14" />
          <div className="absolute right-0 bottom-0 h-5 w-7 border-[#656565] border-r border-b md:h-10 md:w-14" />
        </div>

        <div className="flex w-full flex-col gap-4">
          <p className="flex flex-col justify-between gap-4 bg-[rgba(227,208,255,0.10)] px-3 py-[13px] font-bold text-[#E3D0FF] text-xs leading-[128%] md:flex-row md:items-center md:text-sm">
            <span className="text-left">/ To user:</span>
            <span className="text-right">{email}</span>
          </p>
          <p className="flex flex-col justify-between gap-4 bg-[rgba(227,208,255,0.10)] px-3 py-[13px] font-bold text-[#E3D0FF] text-xs leading-[128%] md:flex-row md:items-center md:text-sm">
            <span className="text-left">/ Title:</span>
            <span className="text-right">Backyard LP Mining Campaign Season 1 Whitelist</span>
          </p>
        </div>
        <div className="text-[#8D8D8D] text-bold text-sm md:text-lg">
          <span className="text-white">Congratulations, you have been whitelisted!</span>
          <br />
          <br />
          <span>
            You will receive an email at {email} with notification of the start date of{" "}
            <span className="text-[#E3D0FF]"> LP Mining Campaign Season 1</span>
          </span>
          <br />
          <br />
          <span>Thank you for your support!</span>
        </div>
      </div>
    </div>
  );
};
