import {
  Text,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import { NFTCollection } from "@thirdweb-dev/sdk";
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
            <div>foo</div>
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
