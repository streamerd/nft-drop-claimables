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
  Box,
} from "@chakra-ui/react";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { ContractMetadata } from "../components/ContractMetadata";

function useAllDrops(address?: string) {
  const sdk = useSDK();
  return useQuery(["drops", address], async () => {
    if (!address) {
      return [];
    }
    return (
      (await sdk?.getContractList(address))?.filter(
        (c) => c.contractType === "nft-drop"
      ) || []
    );
  });
}

export const HomePage: React.FC = () => {
  const address = useAddress();
  const nftDropQuery = useAllDrops(address);

  return (
    <Flex direction={"column"} gap={2} flexGrow={1}>
      <Heading textAlign="center" fontWeight={500} size="sm">
        Your NFT drops
      </Heading>
      {!address ? (
        <Center py={4} w="100%">
          <Text>¯\_(ツ)_/¯</Text>
        </Center>
      ) : nftDropQuery.isLoading ? (
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
          {!nftDropQuery.data?.length ? (
            <Center py={4} w="100%">
              <Heading fontWeight="300" size="xs" fontStyle="italic">
                You have not created any NFT drops yet.
              </Heading>
            </Center>
          ) : (
            <Flex direction="column" gap={2}>
              {nftDropQuery.data.map((nftDrop) => (
                <Box
                  borderRadius="md"
                  as={Link}
                  _hover={{
                    bg: "gray.100",
                    cursor: "pointer",
                  }}
                  to={nftDrop.address}
                  key={nftDrop.address}
                >
                  <ContractMetadata
                    address={nftDrop.address}
                    getterFn={nftDrop.metadata}
                  />
                </Box>
              ))}
            </Flex>
          )}
          <Divider />
          <Center py={4}>
            <Button to="create" as={Link} size="md" colorScheme="brand">
              Create new NFT drop
            </Button>
          </Center>
        </Flex>
      )}
    </Flex>
  );
};
