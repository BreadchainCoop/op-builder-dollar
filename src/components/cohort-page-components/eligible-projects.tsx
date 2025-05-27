"use client";
import { useCitizen } from "@/hooks/use-citizen";
import { useEndorse } from "@/hooks/use-endorse";
import { useProjects } from "@/hooks/use-projects";
import type { CohortProject } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useModal } from "connectkit";
import { CheckCircle, SmileySad, ThumbsUp } from "phosphor-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { AccountName } from "../account-name";
import { LoadingTxModal } from "../mint-page-components/loading-tx-modal";
import { ProjectCard } from "../project-card";
import { Button } from "../ui/button";

export const EligibleProjects = () => {
  const projects = useProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl">
          PROJECTS ELIGIBLE FOR COHORT ({projects.length})
        </h2>
        <span className="text-sub-text text-lg">
          This list includes projects eligible for endorsemests by Optimism
          citizens, determined by an approved Optimism grant council proposal.
          Projects need three citizen endorsemests to join the active cohort,
          with membership typically lasting eight months.
        </span>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-12 gap-y-4 gap-x-6">
        {projects.map((project) => (
          <div key={project.id} className="col-span-4">
            <ProjectCard
              key={project.id}
              project={project}
              className="grid grid-cols-8 w-full gap-2"
            >
              <EndorsementSection
                endorsers={project.endorsers || []}
                projectUid={project.id as `0x${string}`}
                projectName={project.name ?? ""}
              />
            </ProjectCard>
          </div>
        ))}
      </div>
    </div>
  );
};

function MissingEndorsementItems({ n }: { n: number }) {
  const keys = [];

  for (let i = 0; i < n - 1; i++) {
    keys.push(`missingEndorsementItem${i + 1}`);
  }

  return (
    <>
      {keys.map((key) => (
        <li key={key} className="italic text-sub-text">
          -
        </li>
      ))}
      <li className="italic text-sub-text">{n} more endorsement missing</li>
    </>
  );
}

const EndorsementSection = ({
  endorsers,
  projectUid,
  projectName,
}: {
  endorsers: CohortProject["endorsers"];
  projectUid: `0x${string}`;
  projectName: string;
}) => {
  return (
    <div className="w-full col-span-8 flex flex-col gap-4">
      <div className="w-full col-span-8 flex flex-col gap-2">
        <h3 className="font-semibold text-xl">Cohort approval progress</h3>
        <EndorseProgressBar votes={endorsers.length} />
        <span className="text-sub-text-2 italic">Endorsed by</span>
        <ul className="list-disc list-inside ml-4">
          {endorsers?.map((endorser) => (
            <li key={endorser.address} className="italic text-foreground">
              <AccountName
                address={endorser.address}
                ensName={endorser.ensName}
              />
            </li>
          ))}
          {endorsers && endorsers.length < 3 && (
            <MissingEndorsementItems n={3 - endorsers.length} />
          )}
        </ul>
      </div>
      <EndorseButton
        endorsers={endorsers}
        projectUid={projectUid}
        projectName={projectName}
      />
    </div>
  );
};

const EndorseProgressBar = ({ votes }: { votes: number }) => {
  return (
    <div className="w-full bg-background p-[3px] rounded-full flex gap-1">
      {[1, 2, 3].map((value) => (
        <div
          className={cn(
            "bg-card-border h-[6px]  w-1/3",
            votes >= value && "bg-success",
            value === 1 && "rounded-l-full",
            value === 3 && "rounded-r-full",
          )}
          key={value}
        />
      ))}
    </div>
  );
};

interface EndorseButtonProps {
  endorsers: CohortProject["endorsers"];
  projectUid: `0x${string}`;
  projectName: string;
}

const EndorseButton = ({
  endorsers,
  projectUid,
  projectName,
}: EndorseButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { setOpen } = useModal();
  const { address } = useAccount();
  const { isCitizen, fetching } = useCitizen();
  const { trigger, reset, txHashes, loadingMessage, error } = useEndorse({
    projectUid,
  });

  const isEndorsed = endorsers?.some(
    (endorser) => endorser.address === address,
  );

  const buttonStyle = "w-full rounded-[16px] py-4 text-lg font-semibold";

  if (address && fetching) {
    return (
      <div className="w-full rounded-[16px] h-10 bg-card-border animate-pulse" />
    );
  }

  const handleStartEndorse = () => {
    setDialogOpen(true);
    trigger();
  };

  if ((isCitizen && isEndorsed) || endorsers.length >= 3) {
    return (
      <Button
        className={cn(
          buttonStyle,
          "w-full bg-success/10 text-success disabled:opacity-100 rounded-[16px] py-4 text-lg font-semibold",
        )}
        disabled
      >
        <CheckCircle className="text-success min-h-6 min-w-6" weight="bold" />
        {endorsers.length >= 3 ? "ENDORSEMENT COMPLETE" : "ENDORSED"}
      </Button>
    );
  }

  if (!address) {
    return (
      <Button
        className={buttonStyle}
        variant="default"
        onClick={() => setOpen(true)}
      >
        SIGN IN TO ENDORSE
      </Button>
    );
  }

  if (!isCitizen) {
    return (
      <Button
        className={cn(
          buttonStyle,
          "disabled:bg-sub-text-2 disabled:opacity-100 text-content-foreground font-medium flex items-center justify-center",
        )}
        disabled
      >
        <SmileySad className="min-h-6 min-w-6" />
        NO BADGE
      </Button>
    );
  }

  const TxComponent = () => (
    <div className="flex flex-col gap-4 justify-center items-center w-full border-[1px] border-card-border rounded-2xl p-6">
      <span>Endorse {projectName}</span>
    </div>
  );

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <div>
              <Button
                className={buttonStyle}
                variant="default"
                disabled={!isCitizen}
                onClick={handleStartEndorse}
              >
                <ThumbsUp weight="bold" className="min-h-6 min-w-6" /> ENDORSE
                PROJECT
              </Button>
            </div>
          </TooltipTrigger>
          {!isCitizen && (
            <TooltipContent>
              <p>Only Optimism Citizens can endorse projects</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <LoadingTxModal
        isOpen={dialogOpen}
        title="Endorse status"
        successMessage="Endorse success!"
        txComponent={<TxComponent />}
        trigger={trigger}
        reset={reset}
        txHash={
          txHashes && txHashes.length > 0
            ? txHashes[txHashes.length - 1]
            : undefined
        }
        loadingMessage={loadingMessage}
        onClose={() => setDialogOpen(false)}
        error={error}
      />
    </>
  );
};
