import { useLocation, useNavigate } from "react-router";
import Logo from "@/components/icons/backyard-logo.svg";
import BackyardLogo from "@/components/icons/backyard-logo.svg";
import { DisconnectIcon } from "@/components/icons/disconnect";
import { XIcon } from "@/components/icons/x";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { links } from "@/config/links";
import { APP_ROUTES } from "@/config/routes";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import { Button as WhitelistButton } from "@/pages/whitelist/components/ui";
import { truncateAddress } from "@/utils";

const ConnectWallet = () => {
  const { signIn, signOut, address } = useSolanaWallet();
  return address ? (
    <Button className="border-none pr-1" onClick={signOut} variant="secondary">
      {truncateAddress(address)}
      <div className="flex size-[30px] items-center justify-center rounded-[37px] bg-[rgba(196,196,196,0.21)] p-2">
        <DisconnectIcon />
      </div>
    </Button>
  ) : (
    <Button onClick={signIn} variant="secondary">
      Connect Wallet
    </Button>
  );
};

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="z-50 flex w-full items-center justify-between px-12 py-4">
      <button
        className="flex cursor-pointer select-none items-center gap-2 lg:basis-[360px]"
        onClick={() => navigate("/")}
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

export const LandingHeader = () => {
  const { address, signIn, signOut } = useSolanaWallet();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="mx-auto flex w-full max-w-[1350px] items-center justify-between pt-8.5">
      <WhitelistButton onClick={() => navigate(APP_ROUTES.HOME)}>
        <img alt="Backyard logo" className="size-[11px]" src={BackyardLogo} />
        Backyard
      </WhitelistButton>
      <div className="flex items-center gap-2.5">
        <div className="group relative">
          <WhitelistButton border="none" className="relative overflow-hidden" variant="launch">
            <span className="flex items-center justify-center transition-transform duration-300 group-hover:translate-y-[200%]">
              Launch App
            </span>
            <span className="absolute inset-0 flex translate-y-[-100%] items-center justify-center transition-transform duration-300 group-hover:translate-y-0">
              Coming soon
            </span>
          </WhitelistButton>
        </div>
        <WhitelistButton asChild hover="green">
          <a href={links.x} rel="noopener" target="_blank">
            <XIcon className="h-[14px] w-[15px]" />
          </a>
        </WhitelistButton>
        {pathname === APP_ROUTES.WHITELIST &&
          (address ? (
            <WhitelistButton border="none" onClick={signOut}>
              {truncateAddress(address)}
              <DisconnectIcon />
            </WhitelistButton>
          ) : (
            <WhitelistButton border="none" onClick={signIn}>
              Connect Wallet
            </WhitelistButton>
          ))}
      </div>
    </header>
  );
};
