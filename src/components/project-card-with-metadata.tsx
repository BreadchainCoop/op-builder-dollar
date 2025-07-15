import { useIndividualProjectMetadata } from "@/hooks/use-project-metadata";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./project-card";

interface ProjectCardWithMetadataProps {
  project: Partial<Project>;
  children?: React.ReactNode;
  className?: string;
}

export const ProjectCardWithMetadata = ({
  project,
  children,
  className,
}: ProjectCardWithMetadataProps) => {
  const {
    data: metadata,
    isLoading,
    isError,
  } = useIndividualProjectMetadata(project.refUid ?? "");

  // Create project with metadata
  const projectWithMetadata: Partial<Project> = {
    ...project,
    ...(metadata && {
      name: metadata.name,
      description: metadata.description,
      socialLinks: metadata.socialLinks,
    }),
    // Show loading only if we're still fetching and don't have any result yet
    // Also ensure we don't show loading if we have fallback data
    isLoading: isLoading && !metadata && !isError,
  };

  return (
    <ProjectCard project={projectWithMetadata} className={className}>
      {children}
    </ProjectCard>
  );
};
