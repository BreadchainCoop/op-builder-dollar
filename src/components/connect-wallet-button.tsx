"use client";

import { Button } from "@/components/ui/button";
import { ChainIcon } from "@/components/ui/chain-icon";
import { useApy } from "@/hooks/use-apy";
import { useReadObusd } from "@/hooks/use-read-obusd";
import { ConnectButton, useChainModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowSquareOut,
  ArrowsCounterClockwise,
  ChartLineUp,
  Copy,
  Graph,
  SignOut,
  UserCircle,
  Wallet,
} from "phosphor-react";
import { type ReactNode, useState } from "react";
import { formatEther } from "viem";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const isWindow = typeof window !== "undefined";
const isMobile = isWindow ? window.innerWidth <= 1200 : undefined;

export const ConnectWalletButton = () => {
  const { address } = useAccount();
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
  const [open, setOpen] = useState(false);

  const { openChainModal } = useChainModal();

  const handleMouseEnter = () => {
    if (isMobile) return;
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setOpen(false);
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted;
        const truncatedAddress = account?.displayName;
        return (
          <>
            {ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === "authenticated") ? (
              <div className="relative">
                <Popover open={open} onOpenChange={setOpen}>
                  <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <PopoverTrigger
                      onClick={(e) => {
                        !isMobile && e.preventDefault();
                      }}
                      className="focus:outline-none"
                    >
                      <div className="flex items-center justify-center gap-2 border border-card-border rounded-2xl md:pl-3">
                        <div className="hidden md:flex items-center gap-1.5">
                          <ChainIcon id={chain?.id} size={24} />
                          <span className="text-lg">{chain?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 md:bg-background text-foreground rounded-2xl py-2 px-2">
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
                          <span>{ensName ?? truncatedAddress ?? ""}</span>
                        </div>
                      </div>
                    </PopoverTrigger>
                    {/* Invisible connector between trigger and content to keep the hover functionallity working */}
                    {open && (
                      <div className="absolute w-full h-6 bottom-0 translate-y-full" />
                    )}
                  </div>
                  <PopoverContent
                    side="top"
                    sideOffset={20}
                    className="w-[400px] md:w-[400px] md:h-[318px] mx-5"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <WalletAccountDetails
                      chainId={chain?.id}
                      chainName={chain?.name}
                      accountIdentifier={ensName ?? truncatedAddress ?? ""}
                      avatar={avatar ?? undefined}
                      balance={
                        balance?.value !== undefined
                          ? balance.value.toString() === "0"
                            ? "0.0"
                            : Number(formatEther(balance.value)).toFixed(4)
                          : ""
                      }
                      userYearlyYield={userYearlyYield}
                      openSwitchNetworks={openChainModal}
                      address={address}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Button
                onClick={
                  authenticationStatus === "loading"
                    ? () => {}
                    : openConnectModal
                }
                className="flex items-center gap-1.5 rounded-2xl py-2 px-6 text-lg font-normal"
              >
                <span>
                  {authenticationStatus === "loading"
                    ? "Loading..."
                    : "Sign in"}
                </span>
              </Button>
            )}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};

export const WalletAccountDetails = ({
  chainId,
  chainName,
  accountIdentifier,
  avatar,
  balance,
  userYearlyYield,
  openSwitchNetworks,
  address,
  closeMenu,
}: {
  chainId: number | undefined;
  chainName: string | undefined;
  accountIdentifier: string;
  avatar: string | undefined;
  balance: string;
  userYearlyYield: string | undefined;
  openSwitchNetworks: (() => void) | undefined;
  address: string | undefined;
  closeMenu?: () => void;
}) => {
  const { disconnect } = useDisconnect();

  return (
    <div className="z-50 flex flex-col justify-between w-full h-full bg-content gap-6">
      <h1 className="font-bold text-2xl">Account</h1>
      <div className="flex flex-col justify-between gap-4">
        <DetailsRow
          icon={
            avatar ? (
              <Image
                loader={() => avatar}
                src={avatar}
                alt="avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <UserCircle className="text-primary" size={24} />
            )
          }
          leftText={accountIdentifier}
          rightContent={
            <div className="flex gap-2">
              <div
                onClick={() => {
                  if (address) navigator.clipboard.writeText(address);
                }}
                className="w-7 h-7 flex justify-center items-center rounded-md hover:bg-card-border hover:cursor-pointer"
              >
                <Copy className="text-sub-text-2" size={24} />
              </div>
              <Link
                href={`https://optimistic.etherscan.io/address/${address}`}
                target="_blank"
                className="w-7 h-7 flex justify-center items-center rounded-md hover:bg-card-border hover:cursor-pointer"
              >
                <ArrowSquareOut className="text-sub-text-2" size={24} />
              </Link>
            </div>
          }
        />
        <DetailsRow
          icon={<Graph className="text-primary" size={24} />}
          leftText="Network"
          rightContent={
            <div className="flex">
              <div className="w-6 h-6 mr-2">
                <ChainIcon id={chainId} size={24} />
              </div>
              <span>{chainName}</span>
              <div
                onClick={openSwitchNetworks}
                className="flex items-center justify-center w-6 h-6 ml-2 rounded-md hover:bg-card-border hover:cursor-pointer"
              >
                <ArrowsCounterClockwise className="text-secondary" size={16} />
              </div>
            </div>
          }
        />
        <DetailsRow
          icon={<Wallet className="text-primary" size={24} />}
          leftText="ETH Balance"
          rightContent={<span>{balance}</span>}
        />
        <DetailsRow
          icon={<ChartLineUp className="text-primary" size={24} />}
          leftText="Generating obUSD"
          rightContent={
            <span className="font-bold diamond">{userYearlyYield}/Yearly</span>
          }
        />
      </div>
      <Button
        className="flex justify-center items-center rounded-2xl font-normal md:font-bold text-xl w-full"
        onClick={() => {
          if (closeMenu) closeMenu();
          disconnect();
        }}
      >
        <SignOut weight="bold" className="min-w-6 min-h-6" />
        Disconnect
      </Button>
      <Button
        className="md:hidden rounded-2xl font-normal text-xl w-full bg-primary/10 text-primary mt-[-16px] hover:text-content"
        onClick={closeMenu}
      >
        Close Menu
      </Button>
    </div>
  );
};

const DetailsRow = ({
  icon,
  leftText,
  rightContent,
}: { icon: ReactNode; leftText: string; rightContent: ReactNode }) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row justify-center items-center">
        <div className="flex items-center justify-center w-6 h-6 mr-2">
          {icon}
        </div>
        <span className="text-xl text-sub-text">{leftText}</span>
      </div>
      {rightContent}
    </div>
  );
};
