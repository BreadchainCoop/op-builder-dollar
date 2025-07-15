import { ATTESTATION_QUERY } from "@/graphql/attestation-query";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import { useQuery } from "urql";

export interface ProjectMetadata {
  name?: string;
  description?: string;
  socialLinks?: {
    website: string[];
  };
  [key: string]: unknown;
}

interface ProjectData {
  value: {
    name: string;
    value: string;
  };
}

interface ProjectMetadataUrl {
  projectUID: string;
  metadataUrl: string;
}

interface MetadataContent {
  name: string;
  description: string;
  [key: string]: unknown;
}

interface MetadataResult {
  projectUID: string;
  metadata: MetadataContent | null;
  metadataUrl: string;
  success: boolean;
}

export const useProjectMetadata = (projectUID?: string[]) => {
  const [result] = useQuery({
    query: ATTESTATION_QUERY,
    variables: { where: { refUID: { in: projectUID } } },
    pause: !projectUID,
  });

  const attestations = result?.data?.attestations;

  const query = useTanstackQuery({
    queryKey: ["allMetadata"],
    enabled: Boolean(attestations && attestations.length > 0),
    queryFn: async () => {
      if (!(attestations && attestations.length > 0))
        throw new Error("Missing attestations");

      const projectsMetadataURLs: ProjectMetadataUrl[] = [];

      for (const project of attestations) {
        try {
          const projectData = JSON.parse(
            project.decodedDataJson,
          ) as ProjectData[];

          const metadataUrl = projectData.find(
            (data) => data.value.name.toLowerCase() === "metadataurl",
          )?.value.value;

          if (metadataUrl) {
            projectsMetadataURLs.push({
              projectUID: project.refUID,
              metadataUrl,
            });
          }
        } catch (error) {
          console.error(
            `Error parsing project data for ${project.refUID}:`,
            error,
          );
        }
      }

      // Fetch metadata from all URLs
      const metadataResults = await Promise.all(
        projectsMetadataURLs.map(async ({ projectUID, metadataUrl }) => {
          try {
            const response = await fetch(metadataUrl);
            const metadata = await response.json();

            return {
              projectUID,
              metadata,
              metadataUrl,
              success: true,
            } as MetadataResult;
          } catch (error) {
            console.error(
              `Error fetching metadata from ${metadataUrl}:`,
              error,
            );
            return {
              projectUID,
              metadata: null,
              metadataUrl,
              success: false,
            } as MetadataResult;
          }
        }),
      );

      // Group results by project ID
      const projectGroups = metadataResults.reduce<
        Record<string, MetadataResult[]>
      >((groups, result) => {
        if (!groups[result.projectUID]) {
          groups[result.projectUID] = [];
        }

        if (result.success) {
          groups[result.projectUID].push(result);
        }

        return groups;
      }, {});

      // Find the first valid metadata for each project
      const validProjects: Map<string, ProjectMetadata> = new Map();

      // First, handle projects that have metadata URLs but failed to fetch valid data
      for (const [projectUID, results] of Object.entries(projectGroups)) {
        // Find the first result with both name and description
        const validResult = results.find(
          (result) => result?.metadata?.name && result?.metadata?.description,
        );

        if (validResult?.metadata) {
          validProjects.set(projectUID, validResult.metadata);
        } else {
          // If no valid metadata found, create a fallback with "Data not found"
          validProjects.set(projectUID, {
            name: "No data available",
            description: "No data available",
            socialLinks: { website: [] },
          });
        }
      }

      // Then, handle projects that don't have any metadata URLs at all
      for (const project of attestations) {
        if (!validProjects.has(project.refUID)) {
          validProjects.set(project.refUID, {
            name: "No data available",
            description: "No data available",
            socialLinks: { website: [] },
          });
        }
      }

      return validProjects;
    },
  });

  return {
    ...query,
    data: query.data ?? new Map<string, ProjectMetadata>(),
    isLoading: query.isPending || !attestations,
    isFetching: query.isFetching,
  };
};
