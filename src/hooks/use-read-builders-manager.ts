import { buildersManagerAbi } from "@/lib/abis/builders-manager-abi";
import { BUILDERS_MANAGER_ADDRESS } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import { optimism } from "wagmi/chains";

export function useReadBuildersManager() {
  const { chainId } = useAccount();
  const publicClient = usePublicClient({ chainId: chainId ?? optimism.id });

  return useQuery({
    queryKey: ["buildersManager"],
    queryFn: async () => {
      if (!publicClient) throw new Error("missing publicClient");

      const buildersManagerCommon = {
        address: BUILDERS_MANAGER_ADDRESS,
        abi: buildersManagerAbi,
      };

      const result = await publicClient.multicall({
        contracts: [
          {
            ...buildersManagerCommon,
            functionName: "settings",
          },
          {
            ...buildersManagerCommon,
            functionName: "currentProjectUids",
          },
          {
            ...buildersManagerCommon,
            functionName: "currentProjects",
          },
          {
            ...buildersManagerCommon,
            functionName: "optimismFoundationAttesters",
          },
        ],
      });

      if (result[0].status === "failure")
        throw new Error("Error reading builders manager settings");
      if (result[1].status === "failure")
        throw new Error("Error reading builders manager currentProjectUids");
      if (result[2].status === "failure")
        throw new Error("Error reading builders manager currentProjects");
      if (result[3].status === "failure")
        throw new Error("Error reading optimismFoundationAttesters");

      const settings = result[0].result;
      const currentProjectUids = result[1].result;
      const currentProjectRecipients = result[2].result;
      const optimismFoundationAttesters = result[3].result;

      return {
        settings,
        currentProjectUids,
        currentProjectRecipients,
        optimismFoundationAttesters,
      };
    },
  });
}
