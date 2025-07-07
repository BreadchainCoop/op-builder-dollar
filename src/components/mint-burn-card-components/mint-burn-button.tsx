import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Butterfly, Fire } from "phosphor-react";
import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "../ui/button";

interface MintBurnButtonProps {
  isMint: boolean;
  amount: bigint | undefined;
  isLoading: boolean;
  trigger: () => void;
  isInsufficientBalance: boolean;
}

export const MintBurnButton = ({
  isMint,
  amount,
  isLoading,
  trigger,
  isInsufficientBalance,
}: MintBurnButtonProps) => {
  const { chainId, address } = useAccount();
  const { switchChain } = useSwitchChain();

  const buttonClassName = cn(
    "w-full max-w-[384px] h-[56px]",
    "bg-primary hover:bg-error rounded-2xl",
    "flex justify-center items-center gap-2",
    "disabled:bg-sub-text-2  disabled:opacity-100",
    "text-2xl font-medium",
  );

  // No wallet connected
  if (!address) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <Button onClick={openConnectModal} className={buttonClassName}>
            SIGN IN
          </Button>
        )}
      </ConnectButton.Custom>
    );
  }

  // Temporary, for while only sepolia works
  if (chainId !== 10) {
    return (
      <Button
        onClick={() => switchChain({ chainId: 10 })}
        className={buttonClassName}
      >
        SWITCH TO OP MAINNET
      </Button>
    );
  }

  // No amount entered
  if (!amount) {
    return (
      <Button disabled className={buttonClassName}>
        ENTER AMOUNT
      </Button>
    );
  }

  if (isInsufficientBalance) {
    return (
      <Button disabled className={buttonClassName}>
        {isMint ? "INSUFFICIENT USDC" : "INSUFFICIENT obUSD"}
      </Button>
    );
  }

  // Active state - Mint or Burn
  return (
    <Button onClick={trigger} disabled={isLoading} className={buttonClassName}>
      {isMint ? (
        <Butterfly className="min-w-6 min-h-6" />
      ) : (
        <Fire className="min-w-6 min-h-6" />
      )}
      <span>{isMint ? "MINT" : "BURN"}</span>
    </Button>
  );
};
