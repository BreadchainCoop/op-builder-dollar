import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowSquareOut } from "phosphor-react";
import type { ComponentProps } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ProjectCardProps extends ComponentProps<"div"> {
  project: Partial<Project>;
}

export const ProjectCard = ({
  project,
  children,
  className,
}: ProjectCardProps) => {
  const websiteLink = project?.socialLinks?.website?.[0];
  const attestationLink = `https://optimism.easscan.org/attestation/view/${project?.id}`;

  return (
    <Card className="p-4 items-start flex flex-col gap-4">
      <div className="flex flex-col gap-2 w-full">
        {!project?.id ? (
          <>
            <div className="max-w-[250px] w-full h-8 rounded-md bg-card-border animate-pulse" />
            <div className="h-36 md:h-[72px] w-full rounded-md bg-card-border animate-pulse" />
          </>
        ) : project?.isLoading ? (
          <>
            <div className="max-w-[250px] w-full h-8 rounded-md bg-card-border animate-pulse" />
            <div className="h-36 md:h-[72px] w-full rounded-md bg-card-border animate-pulse" />
          </>
        ) : (
          <>
            <h4 className="font-bold text-2xl italic">{project.name}</h4>
            <div className="h-36 md:h-[72px] w-full">
              <span className="italic text-sub-text line-clamp-6 md:line-clamp-3 block">
                {project.description}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href={attestationLink}>
          <Button variant="tertrairy" size="sm" className="font-bold">
            View project attestation
            <ArrowSquareOut size={24} />
          </Button>
        </Link>
        {websiteLink && websiteLink.trim() !== "" ? (
          <Link href={websiteLink} key={websiteLink}>
            <Button variant="tertrairy" size="sm" className="font-bold">
              View more on project Website
              <ArrowSquareOut size={24} />
            </Button>
          </Link>
        ) : (
          <div className="w-[250px] h-9 shrink-0" />
        )}
      </div>
      <div
        className={cn("flex flex-col gap-y-3 gap-x-8 md:flex-row", className)}
      >
        {children}
      </div>
    </Card>
  );
};
