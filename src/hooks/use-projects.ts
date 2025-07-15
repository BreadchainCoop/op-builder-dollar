import type { Project } from "@/lib/types";
import { useMemo } from "react";
import { useEligibleProjects } from "./use-eligible-projects";
import { useProjectCohortData } from "./use-project-cohort-data";

export function useProjects(): Partial<Project>[] {
  const { projects: eligibleProjects } = useEligibleProjects();

  const recipients = eligibleProjects.map(
    (eligibleProject) => eligibleProject.recipient,
  ) as `0x${string}`[];

  const projectsCohortData = useProjectCohortData(recipients);

  // Create projects with basic data immediately
  const projects = useMemo(() => {
    if (!eligibleProjects) return [];

    return eligibleProjects.map((eligibleProject) => {
      const { id, refUid, recipient } = eligibleProject;

      // Get cohort data if available
      const cohortData = projectsCohortData.get(recipient);

      const project: Partial<Project> = {
        id,
        refUid,
        recipient,
        // Add cohort data if available
        ...(cohortData && {
          isCohortMember: cohortData.isCohortMember,
          shareOfYield: cohortData.shareOfYield,
          membershipStartDate: cohortData.membershipStartDate,
          membershipExpirationDate: cohortData.membershipExpirationDate,
          membershipExpirationTimeLeft: cohortData.membershipExpirationTimeLeft,
          endorsers: cohortData.endorsers,
        }),
      };

      return project;
    });
  }, [eligibleProjects, projectsCohortData]);

  return projects;
}
