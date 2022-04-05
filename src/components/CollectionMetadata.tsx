import { Flex, Heading, Skeleton, Image, Text } from "@chakra-ui/react";
import { useCollectionMetadata } from "../hooks/useCollectionMetadata";

export const CollectionMetadata: React.VFC<{
  getterFn?: () => Promise<
    | {
        name?: string;
        description?: string;
        image?: string;
      }
    | undefined
  >;
  address?: string;
}> = ({ getterFn, address }) => {
  const metadataQuery = useCollectionMetadata(address, getterFn);

  return (
    <Flex
      flexGrow={1}
      p={1}
      direction="row"
      gap={4}
      borderRadius="md"
      _groupHover={{
        bg: "gray.100",
        cursor: "pointer",
      }}
    >
      <Skeleton
        overflow="hidden"
        borderRadius="md"
        isLoaded={metadataQuery.isSuccess}
      >
        <Image
          objectFit="contain"
          bg="gray.200"
          src={metadataQuery.data?.image}
          alt={metadataQuery.data?.name}
          boxSize={24}
        />
      </Skeleton>
      <Flex direction="column" gap={2}>
        <Skeleton isLoaded={metadataQuery.isSuccess}>
          <Heading size="sm">{metadataQuery.data?.name || "loading"}</Heading>
        </Skeleton>
        <Skeleton isLoaded={metadataQuery.isSuccess}>
          <Text fontSize="sm" isTruncated noOfLines={3}>
            {metadataQuery.data?.description || "description loading"}
          </Text>
        </Skeleton>
      </Flex>
    </Flex>
  );
};
