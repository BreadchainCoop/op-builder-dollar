import { SCHEMA_QUERY } from "@/graphql/schema-query";
import { buildersManagerAbi } from "@/lib/abis/builders-manager-abi";
import { BUILDERS_MANAGER_ADDRESS, CITIZEN_SCHEMA_ID } from "@/utils/constants";
import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import { useQuery } from "urql";
import { useAccount, usePublicClient } from "wagmi";

export const useCitizen = () => {
  const { address: signer } = useAccount();
  const publicClient = usePublicClient();

  const [{ data, ...result }, refetch] = useQuery({
    query: SCHEMA_QUERY,
    variables: { where: { id: CITIZEN_SCHEMA_ID } },
    requestPolicy: "cache-first",
  });

  const { data: isEligibleVoter } = useTanstackQuery({
    queryKey: [signer],
    queryFn: async () => {
      if (!publicClient) throw new Error("missing public client");
      if (!signer) return false;
      return await publicClient?.readContract({
        address: BUILDERS_MANAGER_ADDRESS,
        abi: buildersManagerAbi,
        functionName: "eligibleVoter",
        args: [signer],
      });
    },
  });

  const { address } = useAccount();

  const citizenAttestations = data?.getSchema?.attestations.filter(
    (attestation) => !attestation.revoked,
  );

  const citizensList = citizenAttestations?.map(
    (attestation) => attestation.recipient,
  );

  const isCitizen =
    (address && citizensList?.includes(address)) || isEligibleVoter;

  const citizenAttestationUid =
    address && citizensList?.includes(address) && !isEligibleVoter
      ? (citizenAttestations?.find(
          (attestation) => attestation.recipient === address,
        )?.id as `0x${string}`)
      : undefined;
  data?.getSchema?.attestations.find((attestation) => !attestation.revoked);

  return {
    citizensList,
    citizenAttestationUid,
    isCitizen,
    refetch,
    data,
    ...result,
  };
};
