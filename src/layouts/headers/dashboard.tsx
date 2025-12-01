import { useNavigate } from "react-router";
import { Navbar } from "@/common/components/navbar";
import { Button } from "@/common/components/ui/button";
import { truncateAddress } from "@/common/utils";
import Logo from "@/icons/backyard-logo.svg";
import { DisconnectIcon } from "@/icons/disconnect";
import { APP_ROUTES } from "@/routes";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";

const ConnectWallet = () => {
  const { signIn, signOut, address } = useSolanaWallet();
  return address ? (
    <Button className="group border-none pr-1" onClick={signOut} variant="secondary">
      {truncateAddress(address)}
      <div className="flex size-[30px] items-center justify-center rounded-[37px] bg-[rgba(196,196,196,0.21)] p-2 transition-all duration-300 group-hover:bg-red-500/10">
        <DisconnectIcon />
      </div>
    </Button>
  ) : (
    <Button onClick={signIn} variant="secondary">
      Connect Wallet
    </Button>
  );
};

export const DashboardHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="z-50 flex w-full items-center justify-between px-12 py-4">
      <button
        className="flex cursor-pointer select-none items-center gap-2 lg:basis-[360px]"
        onClick={() => navigate(APP_ROUTES.VAULTS)}
        type="button"
      >
        <img alt="backyard" src={Logo} />
        <span className="text-[rgba(51,51,51,0.95)] text-base leading-normal [font-family:Gilroy]">Backyard</span>
      </button>
      <Navbar />
      <div className="flex items-center justify-end gap-4 lg:basis-[360px]">
        <ConnectWallet />
      </div>
    </header>
  );
};
