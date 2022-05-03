import { useQuery } from "react-query";

export function useDropMetadata(
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
    ["drop", "metadata", address],
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
