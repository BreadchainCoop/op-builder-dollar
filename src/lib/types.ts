import type { Address } from "viem";

export type EndorserType = {
  address: Address;
  ensName: string | undefined | null;
};

export interface EligibleProject {
  id: string;
  recipient: string;
  refUid: string;
  name?: string;
  description?: string;
  projectLinks?: ProjectLink[];
  socialLinks?: { website: string[] };
  endorsers: EndorserType[];
  isCohortMember: boolean;
  isLoading?: boolean;
}

export interface CohortProject extends EligibleProject {
  shareOfYield: number;
  membershipStartDate: string;
  membershipExpirationDate: string;
  membershipExpirationTimeLeft: string;
}

export type Project = EligibleProject | CohortProject;

type ProjectLink = {
  href: string;
  label: string;
};
