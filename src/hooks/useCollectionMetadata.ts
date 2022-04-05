import { useQuery } from "react-query";

export function useCollectionMetadata(
  address?: string,
  queryFn?: () => Promise<
    | {
        name?: string;
        description?: string;
        image?: string;
      }
    | undefined
  >
) {
  return useQuery(
    ["collection", "metadata", address],
    async () => {
      if (queryFn) {
        return await queryFn();
      }
      return undefined;
    },
    {
      enabled: !!address && typeof queryFn === "function",
    }
  );
}
