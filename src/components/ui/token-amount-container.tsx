import { TokenAmountInput } from "@/components/token-amount-input";
import ObUsd from "@/components/ui/obusd";
import Usdc from "@/components/ui/usdc";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TradeToken = "USDC" | "obUSD";

const tokenCardClass =
  "flex gap-2 p-1 bg-card-bg-2 border-[1px] border-card-border rounded-xl";

const tokenCardMap: Record<TradeToken, ReactNode> = {
  USDC: (
    <div className={tokenCardClass}>
      <Usdc size={24} />
      USDC
    </div>
  ),
  obUSD: (
    <div className={tokenCardClass}>
      <ObUsd size={24} />
      obUSD
    </div>
  ),
};

export const TokenAmountContainer = ({
  token,
  balance,
  value,
  onValueChange,
  className,
}: {
  token: TradeToken;
  balance: string;
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const fiatBalance = balance.includes("<")
    ? balance.replace("< ", "~")
    : `~${balance}`;

  return (
    <div
      className={cn(
        "flex flex-col justify-between w-full max-w-[384px] h-[104px] rounded-3xl border-[1px] border-card-border p-3",
        className,
      )}
    >
      <span className="text-sm text-sub-text">You burn</span>
      <div className="flex justify-between items-center">
        <TokenAmountInput value={value} onValueChange={onValueChange} />
        {tokenCardMap[token]}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-sub-text-2 font-medium">
          {fiatBalance}
        </span>
        <span className="text-xs text-sub-text-2 font-medium">
          {`Balance: ${balance} ${token}`}
        </span>
      </div>
    </div>
  );
};
