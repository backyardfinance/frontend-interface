import { useLocation, useNavigate } from "react-router";
import { truncateAddress } from "@/common/utils";
import { links } from "@/config/links";
import BackyardLogo from "@/icons/backyard-logo.svg";
import { DisconnectIcon } from "@/icons/disconnect";
import { XIcon } from "@/icons/x";
import { APP_ROUTES } from "@/routes";
import { useSolanaWallet } from "@/solana/hooks/useSolanaWallet";
import { Button } from "@/whitelist/components/ui";

export const LandingHeader = () => {
  const { address, signIn, signOut } = useSolanaWallet();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isWhitelist = pathname === APP_ROUTES.WHITELIST;

  return (
    <header className="mx-auto flex w-full max-w-[1350px] items-center justify-between pt-8.5">
      <Button onClick={() => navigate(APP_ROUTES.HOME)}>
        <img alt="Backyard logo" className="size-[11px]" src={BackyardLogo} />
        Backyard
      </Button>
      <div className="flex items-center gap-2.5">
        <div className="group relative">
          {!isWhitelist && (
            <Button border="none" className="relative overflow-hidden" variant="launch">
              <span className="flex items-center justify-center transition-transform duration-300 group-hover:translate-y-[200%]">
                Launch App
              </span>
              <span className="absolute inset-0 flex translate-y-[-100%] items-center justify-center transition-transform duration-300 group-hover:translate-y-0">
                Coming soon
              </span>
            </Button>
          )}
        </div>
        <Button asChild hover="green">
          <a href={links.x} rel="noopener" target="_blank">
            <XIcon className="h-[14px] w-[15px]" />
          </a>
        </Button>
        {isWhitelist &&
          (address ? (
            <Button border="none" onClick={signOut}>
              {truncateAddress(address)}
              <DisconnectIcon />
            </Button>
          ) : (
            <Button border="none" onClick={signIn}>
              Connect Wallet
            </Button>
          ))}
      </div>
    </header>
  );
};
