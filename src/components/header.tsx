"use client";

import { useApy } from "@/hooks/use-apy";
import { useReadObusd } from "@/hooks/use-read-obusd";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/use-theme-store";
import { formatTokenBalance } from "@/utils/formatting";
import { useChainModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import {
  Butterfly,
  Gift,
  List,
  Moon,
  ShareNetwork,
  Sun,
  UsersThree,
} from "phosphor-react";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useEnsAvatar, useEnsName } from "wagmi";
import {
  ConnectWalletButton,
  WalletAccountDetails,
} from "./connect-wallet-button";
import LogoComponent from "./logo";
import NavLink from "./nav-link";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const themeButtonStyle =
  "py-2 pl-3 hover:bg-secondary/10 flex-1 w-full items-center justify-start text-lg";

const isWindow = typeof window !== "undefined";

const isMobile = isWindow ? window.innerWidth <= 1200 : undefined;
const isNotLargeWindow = isWindow ? window.innerWidth <= 1500 : undefined;

const Header = () => {
  const { setTheme, theme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const [mobileWalletOpen, setMobileWalletOpen] = useState(false);
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);

  const { address, chain, isConnecting } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address, chainId: 1 });
  const { data: avatar } = useEnsAvatar({
    name: ensName ? ensName : undefined,
    chainId: 1,
  });
  const { apy } = useApy() ?? {};
  const { obusdFormattedBalance } = useReadObusd();
  const userYearlyYield =
    apy !== undefined && obusdFormattedBalance
      ? (
          (Number(obusdFormattedBalance.replace("< 0.01", "0.0")) *
            Number(apy)) /
          100
        ).toFixed(2)
      : "0.0";
  const { openChainModal } = useChainModal();

  const accountIdentifier =
    ensName ??
    `${address?.slice(0, 6)}...${address?.slice(address.length - 5, address.length - 1)}` ??
    "";

  const handleMouseEnter = () => {
    if (!isMobile) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!address) setMobileWalletOpen(false);
  }, [address]);

  const closeMobilePopovers = () => {
    setMobileOptionsOpen(false);
    setMobileWalletOpen(false);
  };

  if (isMobile)
    return (
      <div className="z-50 h-0 mb-[-24px]">
        <header
          className={cn(
            "z-50 flex flex-col items-center justify-start relative h-fit bg-content mx-4 mt-6 px-3 rounded-3xl shadow-lg",
            (mobileOptionsOpen || mobileWalletOpen) &&
              "border-[1px] border-card-border shadow-card-border",
          )}
        >
          <div className="w-full min-h-14 flex items-center justify-between">
            <Link href="/">
              <LogoComponent className="text-primary" />
            </Link>
            <div className="flex items-center justify-center gap-4">
              {address ? (
                <div
                  className="flex items-center gap-1.5 text-foreground rounded-2xl py-2 px-2 border-card-border border-[1px] hover:cursor-pointer"
                  onClick={() => {
                    setMobileWalletOpen(!mobileWalletOpen);
                    setMobileOptionsOpen(false);
                  }}
                >
                  {avatar && (
                    <Image
                      loader={() => avatar}
                      src={avatar}
                      alt="avatar"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span>{accountIdentifier}</span>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    openChainModal;
                  }}
                  className="flex items-center gap-1.5 rounded-2xl py-2 px-6 text-lg font-normal"
                >
                  <span>{isConnecting ? "Loading..." : "Sign in"}</span>
                </Button>
              )}
              <List
                onClick={() => {
                  setMobileOptionsOpen(!mobileOptionsOpen);
                  setMobileWalletOpen(false);
                }}
                size={24}
                className="text-primary"
              />
            </div>
          </div>
          {mobileWalletOpen && (
            <>
              <WalletAccountDetails
                chainId={chain?.id}
                chainName={chain?.name}
                accountIdentifier={accountIdentifier}
                avatar={avatar ?? undefined}
                balance={
                  balance?.value !== undefined
                    ? formatTokenBalance(balance.value, 18, 4)
                    : ""
                }
                userYearlyYield={userYearlyYield}
                openSwitchNetworks={openChainModal}
                address={address}
                closeMenu={() => {
                  setMobileWalletOpen(false);
                }}
              />
              <div className="h-3" />
            </>
          )}
          {mobileOptionsOpen && (
            <>
              <div className="z-50 flex w-full flex-col justify-start items-start gap-4 pt-2">
                <NavLink
                  href="/"
                  icon={Butterfly}
                  onLinkClick={closeMobilePopovers}
                >
                  Mint
                </NavLink>
                <NavLink
                  href="/yield"
                  icon={ShareNetwork}
                  iconClassName="rotate-90"
                  onLinkClick={closeMobilePopovers}
                >
                  Yield {!isMobile && "distribution"}
                </NavLink>
                <NavLink
                  href="/cohort-selection"
                  icon={UsersThree}
                  onLinkClick={closeMobilePopovers}
                >
                  Cohort {!isMobile && "selection"}
                </NavLink>
                <NavLink
                  href=""
                  icon={Gift}
                  disabled={true}
                  onLinkClick={closeMobilePopovers}
                >
                  Rewards
                </NavLink>

                <div className="flex flex-col items-start gap-2">
                  <span className="text-2xl font-bold">Theme</span>
                  <Button
                    variant="ghost"
                    onClick={() => setTheme("light")}
                    className={themeButtonStyle}
                  >
                    <Sun size={18} className="text-primary" />
                    Light
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setTheme("dark")}
                    className={themeButtonStyle}
                  >
                    <Moon size={18} className="text-primary" />
                    Dark
                  </Button>
                </div>
              </div>
              <div className="h-3" />
            </>
          )}
        </header>
      </div>
    );

  return (
    <div className="h-0 mb-[-24px]">
      <header className="flex relative h-14 items-center justify-between bg-content mx-5 mt-6 px-5 rounded-3xl shadow-lg">
        <Link href="/" className="flex items-center gap-2">
          <LogoComponent className="text-primary" />
          <h1 className="text-content-foreground font-bold text-lg font-roboto-mono text-center">
            obUSD
          </h1>
        </Link>
        <div className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 lg:gap-7 text-lg">
          <NavLink href="/" icon={Butterfly}>
            Mint
          </NavLink>
          <NavLink href="/yield" icon={ShareNetwork} iconClassName="rotate-90">
            Yield {!isNotLargeWindow && "distribution"}
          </NavLink>
          <NavLink href="/cohort-selection" icon={UsersThree}>
            Cohort {!isNotLargeWindow && "selection"}
          </NavLink>
          <NavLink href="" icon={Gift} disabled={true}>
            Rewards
          </NavLink>
        </div>
        <div className="flex items-center gap-2">
          <ConnectWalletButton />
          <div
            className="relative flex"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                className="flex items-center justify-center rounded-full bg-primary/10 p-1 w-8 h-8 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                {theme === "light" ? (
                  <Sun size={18} className="text-primary" />
                ) : (
                  <Moon size={18} className="text-primary" />
                )}
              </PopoverTrigger>
              {/* Invisible connector between trigger and content to keep the hover functionallity working */}
              {open && (
                <div className="absolute w-full h-6 bottom-0 translate-y-full" />
              )}
              <PopoverContent
                className="px-6 py-3 border border-card-border bg-content flex flex-col items-start mt-5 mr-5"
                sideOffset={5}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="text-2xl font-bold">Theme</span>
                <p className="text-base text-sub-text mb-2">
                  Select your preference
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setTheme("light")}
                  className={themeButtonStyle}
                >
                  <Sun size={18} className="text-primary" />
                  Light
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setTheme("dark")}
                  className={themeButtonStyle}
                >
                  <Moon size={18} className="text-primary" />
                  Dark
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
