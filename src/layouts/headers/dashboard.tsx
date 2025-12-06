import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SignInAlertDialog } from "@/auth/components/SignInAlertDialog";
import { Navbar } from "@/common/components/navbar";
import { Button } from "@/common/components/ui/button";
import { truncateAddress } from "@/common/utils";
import { localStorageService } from "@/common/utils/localStorageService";
import Logo from "@/icons/backyard-logo.svg";
import { DisconnectIcon } from "@/icons/disconnect";
import { APP_ROUTES } from "@/routes";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";

const ConnectWallet = () => {
  const { signIn, signOut, address } = useSolanaWallet();
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  useEffect(() => {
    if (address && !localStorageService.getAccessToken()) {
      setShowSignInDialog(true);
    }
  }, [address]);

  if (!address) {
    return (
      <Button onClick={signIn} variant="secondary">
        Connect Wallet
      </Button>
    );
  }

  return (
    <>
      <Button className="group border-none pr-1" onClick={signOut} variant="secondary">
        {truncateAddress(address)}
        <div className="flex size-[30px] items-center justify-center rounded-[37px] bg-[rgba(196,196,196,0.21)] p-2 transition-all duration-300 group-hover:bg-red-500/10">
          <DisconnectIcon />
        </div>
      </Button>
      <SignInAlertDialog onOpenChange={setShowSignInDialog} open={showSignInDialog} />
    </>
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
        <span className="font-[Gilroy] text-[rgba(51,51,51,0.95)] text-base leading-normal">Backyard</span>
      </button>
      <Navbar />
      <div className="flex items-center justify-end gap-4 lg:basis-[360px]">
        <ConnectWallet />
      </div>
    </header>
  );
};
