import {
  Text,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

function useAllCollections(address?: string) {
  const sdk = useSDK();
  return useQuery(["collections", address], async () => {
    if (!address) {
      return [];
    }
    return (
      (await sdk?.getContractList(address))?.filter(
        (c) => c.contractType === "nft-collection"
      ) || []
    );
  });
}

export const HomePage: React.FC = () => {
  const address = useAddress();
  const nftCollectionQuery = useAllCollections(address);

  return (
    <Flex direction={"column"} gap={2} flexGrow={1}>
      <Heading textAlign="center" fontWeight={500} size="sm">
        Your collections
      </Heading>
      {!address ? (
        <Center py={4} w="100%">
          <Text>¯\_(ツ)_/¯</Text>
        </Center>
      ) : nftCollectionQuery.isLoading ? (
        <Center py={4} w="100%">
          <Flex gap={2} align="center">
            <Spinner size="sm" />
            <Heading fontWeight={300} as="h5" size="xs">
              loading
            </Heading>
          </Flex>
        </Center>
      ) : (
        <Flex direction="column" gap={2}>
          {!nftCollectionQuery.data?.length ? (
            <Center py={4} w="100%">
              <Heading fontWeight="300" size="xs" fontStyle="italic">
                You have not created any collections yet.
              </Heading>
            </Center>
          ) : (
            <Flex direction="column" gap={2}>
              {nftCollectionQuery.data.map((collection) => (
                <CollectionRow
                  address={collection.address}
                  getterFn={collection.metadata}
                />
              ))}
            </Flex>
          )}
          <Divider />
          <Center py={4}>
            <Button to="create" as={Link} size="md" colorScheme="brand">
              Create new collection
            </Button>
          </Center>
        </Flex>
      )}
    </Flex>
  );
};

export function useContractMetadataWithAddress(
  address: string,
  queryFn: () => Promise<{ name: string; description?: string; image?: string }>
) {
  return useQuery(["collection", "metadata", address], () => queryFn(), {
    enabled: !!address && typeof queryFn === "function",
  });
}

const CollectionRow: React.VFC<{
  getterFn: () => Promise<{
    name: string;
    description?: string;
    image?: string;
  }>;
  address: string;
}> = ({ getterFn, address }) => {
  const metadataQuery = useContractMetadataWithAddress(address, getterFn);

  return (
    <Link to={address}>
      <Flex
        p={1}
        direction="row"
        gap={4}
        borderRadius="md"
        _hover={{ bg: "gray.100", cursor: "pointer" }}
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
    </Link>
  );
};
