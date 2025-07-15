import type { Project } from "@/lib/types";
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

  // Create projects immediately with basic data
  const projects = useMemo(() => {
    if (!eligibleProjects) return [];

    return eligibleProjects.map((eligibleProject) => {
      const { id, refUid, recipient } = eligibleProject;
      const project: Partial<Project> = { id, refUid, recipient };

      // Add metadata if available
      const metadata = metadatas?.get(refUid ?? "");
      if (metadata) {
        const { name, description, socialLinks } = metadata;
        Object.assign(project, { name, description, socialLinks });
      } else {
        // Apply fallback data if metadata doesn't exist
        Object.assign(project, {
          name: "No data available",
          description: "No data available",
          socialLinks: { website: [] },
        });
      }

      // Add cohort data if available
      const cohortData = projectsCohortData.get(recipient);
      if (cohortData) {
        const {
          isCohortMember,
          shareOfYield,
          membershipStartDate,
          membershipExpirationDate,
          membershipExpirationTimeLeft,
          endorsers,
        } = cohortData;
        Object.assign(project, {
          isCohortMember,
          shareOfYield,
          membershipStartDate,
          membershipExpirationDate,
          membershipExpirationTimeLeft,
          endorsers,
        });
      }

      return project;
    });
  }, [eligibleProjects, metadatas, projectsCohortData]);

  return projects;
}
