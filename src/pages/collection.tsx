import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useNFTCollection } from "@thirdweb-dev/react";
import { NFTCollection } from "@thirdweb-dev/sdk";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { CollectionMetadata } from "../components/CollectionMetadata";
import { NftCollectionItem } from "../components/NFTCollectionItem";

function useCollectionItems(collection?: NFTCollection) {
  return useQuery(
    ["collection", collection?.getAddress(), "items"],
    async () => {
      return await collection?.getAll();
    },
    {
      enabled: !!collection,
    }
  );
}

export const CollectionPage: React.FC = () => {
  const params = useParams();
  const collection = useNFTCollection(params.collectionAddress);

  const itemsQuery = useCollectionItems(collection);

  return (
    <Flex direction="column" gap={2}>
      <Flex direction="row" gap={2} align="center">
        <CollectionMetadata
          address={params.collectionAddress}
          getterFn={async () => await collection?.metadata.get()}
        />
        <Button
          flexGrow={0}
          flexShrink={0}
          to="mint"
          as={Link}
          size="md"
          colorScheme="brand"
        >
          Mint new NFT
        </Button>
      </Flex>
      <Divider />
      {itemsQuery.isLoading ? (
        <Center py={4} w="100%">
          <Flex gap={2} align="center">
            <Spinner size="sm" />
            <Heading fontWeight={300} as="h5" size="xs">
              loading
            </Heading>
          </Flex>
        </Center>
      ) : !itemsQuery.data?.length ? (
        <Center py={4} w="100%">
          <Heading fontWeight="300" size="xs" fontStyle="italic">
            You have not minted any NFTs in this collection yet.
          </Heading>
        </Center>
      ) : (
        <SimpleGrid gap={4} columns={{ base: 2, sm: 3, md: 4, lg: 5 }}>
          {itemsQuery.data?.map((item) => (
            <NftCollectionItem key={item.metadata.id.toString()} item={item} />
          ))}
        </SimpleGrid>
      )}
    </Flex>
  );
};
