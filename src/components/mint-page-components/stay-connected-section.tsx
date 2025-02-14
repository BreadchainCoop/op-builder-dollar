import githubSrc from "@/../public/icons/github.png";
import warpcastSrc from "@/../public/icons/warpcast.png";
import xSrc from "@/../public/icons/x.png";
import texture from "@/../public/images/texture.png";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/use-theme-store";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export default function StayConnectedSection() {
  return (
    <>
      <div className="h-16 md:h-[100px]" />
      <p className="text-xl md:text-2xl font-bold italic mb-6 text-center">
        STAY CONNECTED
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 px-4 md:px-0">
        <StayConnectedCard
          title="Inspect our"
          subtitle="Github repo"
          image={githubSrc}
          link="https://github.com/BreadchainCoop/builders-dollar"
          backgroundPosition="left 0% top 0%"
        />
        <StayConnectedCard
          title="Follow us on"
          subtitle="Farcaster"
          image={warpcastSrc}
          link="https://warpcast.com/optimisticusd"
          backgroundPosition="left 30% top 0%"
        />
        <StayConnectedCard
          title="Follow us on"
          subtitle="X"
          image={xSrc}
          link="https://x.com/optimisticUSD"
          backgroundPosition="left 60% top 0%"
        />
      </div>
      <div className="h-16 md:h-[100px]" />
    </>
  );
}

const StayConnectedCard = ({
  title,
  subtitle,
  image,
  link,
  backgroundPosition,
}: {
  title: string;
  subtitle: string;
  image: StaticImageData;
  link: string;
  backgroundPosition: string;
}) => {
  const { theme } = useThemeStore();

  return (
    <Link
      href={link}
      target="_blank"
      className={cn(
        "w-[350px] h-[168px] flex justify-between bg-content rounded-4xl",
        { "bg-[#191919] text-white": theme === "light" },
      )}
      style={{ backgroundImage: `url(${texture.src})`, backgroundPosition }}
    >
      <div className="pt-5 pl-5">
        <p className="text-xl font-semibold text-sub-text mb-2">{title}</p>
        <p className="">{subtitle}</p>
      </div>
      <Image src={image} alt={link} height={168} />
    </Link>
  );
};
