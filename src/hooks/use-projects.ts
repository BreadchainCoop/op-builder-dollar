import type { Project } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useEligibleProjects } from "./use-eligible-projects";
import { useProjectCohortData } from "./use-project-cohort-data";
import { useProjectMetadata } from "./use-project-metadata";

export function useProjects(): Partial<Project>[] {
  const { projects: eligibleProjects } = useEligibleProjects();

  const recipients = eligibleProjects.map(
    (eligibleProject) => eligibleProject.recipient,
  ) as `0x${string}`[];
  const refUids = eligibleProjects.map(
    (eligibleProject) => eligibleProject.refUid,
  );

  const { data: metadatas } = useProjectMetadata(refUids);

  const projectsCohortData = useProjectCohortData(recipients);

  const eligibleProjectsKeys = useMemo(
    () => JSON.stringify(Array.from(eligibleProjects.entries())),
    [eligibleProjects],
  );
  const metadatasKeys = useMemo(
    () => JSON.stringify(Array.from(metadatas.entries())),
    [metadatas],
  );
  const projectsCohortDataKeys = useMemo(
    () => JSON.stringify(Array.from(projectsCohortData.entries())),
    [projectsCohortData],
  );

  const { data: projects } = useQuery({
    queryKey: [
      "projects",
      eligibleProjectsKeys,
      metadatasKeys,
      projectsCohortDataKeys,
    ],
    queryFn: () => {
      const newProjects = [] as Partial<Project>[];

      if (eligibleProjects) {
        for (const eligibleProject of eligibleProjects) {
          const { id, refUid, recipient } = eligibleProject;
          newProjects.push({ id, refUid, recipient });
        }

        if (metadatas && newProjects.length) {
          for (const project of newProjects) {
            const { refUid } = project;
            const metadata = metadatas.get(refUid ?? "");

            if (metadata) {
              const { name, description, socialLinks } = metadata;
              Object.assign(project, { name, description, socialLinks });
            }
          }
        }

        if (projectsCohortData) {
          for (const [id, projectCohortData] of projectsCohortData) {
            const idx: number = newProjects.findIndex(
              (newProject) => newProject.recipient === id,
            );
            const {
              isCohortMember,
              shareOfYield,
              membershipStartDate,
              membershipExpirationDate,
              membershipExpirationTimeLeft,
              endorsers,
            } = projectCohortData;
            if (idx !== -1)
              newProjects[idx] = {
                ...newProjects[idx],
                isCohortMember,
                shareOfYield,
                membershipStartDate,
                membershipExpirationDate,
                membershipExpirationTimeLeft,
                endorsers,
              };
          }
        }
      }

      const projectsWithNames = newProjects.filter(
        (p) => p.name && p.name.trim() !== "",
      );
      console.log(
        `[DEBUG] useProjects: Final projects with names: ${projectsWithNames.length}/${newProjects.length}`,
      );

      return newProjects as Partial<Project>[];
    },
  });

  return projects ?? [];
}
