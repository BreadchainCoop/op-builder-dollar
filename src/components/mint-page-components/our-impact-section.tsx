import texture from "@/../public/images/texture.png";
import { useApy } from "@/hooks/use-apy";
import { useDuneStats } from "@/hooks/use-dune-stats";
import { useReadObusd } from "@/hooks/use-read-obusd";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/use-theme-store";
import type { ReactNode } from "react";
import LoadingDots from "../ui/loading-dots";
import ObUsd from "../ui/obusd";

export default function OurImpactSection() {
  const { theme } = useThemeStore();
  const { data } = useDuneStats();
  const { apy } = useApy() ?? {};
  const { obusdTotalSupplyFormatted } = useReadObusd();

  const {
    totalYieldGeneratedOvertime,
    totalObusdTransactions,
    totalTeamsFunded,
    totalUsers,
  } = data ?? {};

  const lightBorderClass = cn({
    "border-[1px] border-card-border": theme === "light",
  });

  return (
    <div
      className="flex flex-col w-full justify-center items-center bg-cover rounded-[30px] md:rounded-[60px] border-b-[1px] border-t-[1px] border-card-border"
      style={{ backgroundImage: `url(${texture.src})` }}
    >
      <div className="flex flex-col py-12 md:py-20 gap-4 w-full px-4 md:px-0 md:w-[738px]">
        <p className="text-xl md:text-2xl font-bold italic mb-2 text-center md:text-left">
          OUR IMPACT
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] w-full md:w-[738px] gap-4">
          <ImpactCard
            title="Total yield generated overtime"
            content={
              <span className="text-3xl md:text-4xl text-success font-bold italic">
                {totalYieldGeneratedOvertime ? (
                  `$${totalYieldGeneratedOvertime}`
                ) : (
                  <LoadingDots />
                )}
              </span>
            }
            className="bg-card-bg"
          />
          <ImpactCard
            title="Total teams funded"
            content={
              <span className="text-3xl md:text-4xl font-bold italic">
                {totalTeamsFunded ?? <LoadingDots />}
              </span>
            }
            className={lightBorderClass}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] w-full md:w-[738px] gap-4">
          <ImpactCard
            title="Current APY"
            content={
              <span className="text-3xl md:text-4xl font-bold italic">
                {apy ? `${apy}%` : <LoadingDots />}
              </span>
            }
            className={lightBorderClass}
          />
          <ImpactCard
            title="Total obUSD minted"
            content={
              <div className="flex gap-2">
                <ObUsd size={32} />
                <span className="text-3xl md:text-4xl font-bold italic">
                  {obusdTotalSupplyFormatted ?? <LoadingDots />}
                </span>
              </div>
            }
            className={lightBorderClass}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] w-full md:w-[738px] gap-4">
          <ImpactCard
            title="Total users"
            content={
              <span className="text-3xl md:text-4xl font-bold italic">
                {totalUsers ?? <LoadingDots />}
              </span>
            }
            className={lightBorderClass}
          />
          <ImpactCard
            title="Total obUSD transactions"
            content={
              <span className="text-3xl md:text-4xl font-bold italic">
                {totalObusdTransactions ?? <LoadingDots />}
              </span>
            }
            className={lightBorderClass}
          />
        </div>
      </div>
    </div>
  );
}

const ImpactCard = ({
  title,
  content,
  className,
}: { title: string; content: ReactNode; className?: string }) => {
  return (
    <div className="h-[168px]">
      <div
        className={cn(
          "w-full h-[168px] bg-content flex justify-center items-center gap-6 rounded-2xl md:rounded-3xl px-4 md:px-8 py-8 md:py-12",
          className,
        )}
      >
        {content}
      </div>
      <span className="max-w-[227px] relative top-[-148px] left-6 text-sub-text text-sm md:text-base">
        {title}
      </span>
    </div>
  );
};
