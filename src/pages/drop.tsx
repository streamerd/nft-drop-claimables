import {
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useNFTDrop } from "@thirdweb-dev/react";
import { NFTDrop } from "@thirdweb-dev/sdk";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { ContractMetadata } from "../components/ContractMetadata";
import { NftDropItem } from "../components/NftDropItem";

function useLazyMintedItems(drop?: NFTDrop) {
  return useQuery(
    ["drop", drop?.getAddress(), "lazy-items"],
    async () => {
      return await drop?.getAllUnclaimed();
    },
    {
      enabled: !!drop,
    }
  );
}

function useClaimedItems(drop?: NFTDrop) {
  return useQuery(
    ["drop", drop?.getAddress(), "claimed-items"],
    async () => {
      return await drop?.getAllClaimed();
    },
    {
      enabled: !!drop,
    }
  );
}

export const DropPage: React.FC = () => {
  const params = useParams();
  const drop = useNFTDrop(params.dropAddress);

  const lazyItemsQuery = useLazyMintedItems(drop);
  const claimedItemsQuery = useClaimedItems(drop);

  const [price, setPrice] = useState<string>("0");

  const claimCondition = useMutation(async () => {
    if (!drop) {
      throw new Error("no drop ready");
    }
    if (!price) {
      throw new Error("no price set");
    }
    return await drop.claimConditions.set([{ price }]);
  });

  return (
    <Flex direction="column" gap={2}>
      <Flex direction="row" gap={2} align="center">
        <ContractMetadata
          address={params.dropAddress}
          getterFn={async () => await drop?.metadata.get()}
        />
        <Button
          flexGrow={0}
          flexShrink={0}
          to="mint"
          as={Link}
          size="md"
          colorScheme="brand"
        >
          Create new drop
        </Button>
      </Flex>
      <Divider my={8} />
      <Flex
        direction="column"
        p={4}
        borderRadius="md"
        borderWidth="1px"
        gap={2}
      >
        <Heading size="sm">Set Claim Condition</Heading>
        <Text fontStyle="italic">
          You need to set a claim condition before claiming is possible.
        </Text>
        <FormControl>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </FormControl>
        <Button
          isLoading={claimCondition.isLoading}
          onClick={() => claimCondition.mutate()}
          variant="outline"
          colorScheme="brand"
        >
          Set Claim Condition
        </Button>
      </Flex>
      <Divider my={8} />
      <Heading>Available Drops</Heading>
      {lazyItemsQuery.isLoading ? (
        <Center py={4} w="100%">
          <Flex gap={2} align="center">
            <Spinner size="sm" />
            <Heading fontWeight={300} as="h5" size="xs">
              loading
            </Heading>
          </Flex>
        </Center>
      ) : !lazyItemsQuery.data?.length ? (
        <Center py={4} w="100%">
          <Heading fontWeight="300" size="xs" fontStyle="italic">
            You have not created any drops yet.
          </Heading>
        </Center>
      ) : (
        <Flex direction="column" gap={2}>
          <SimpleGrid gap={4} columns={{ base: 2, sm: 3, md: 4, lg: 5 }}>
            {lazyItemsQuery.data?.map((item) => (
              <NftDropItem
                key={item.id.toString()}
                item={{ owner: "", metadata: item }}
                canBeClaimed
              />
            ))}
          </SimpleGrid>
        </Flex>
      )}
      <Divider my={8} />
      <Heading>Claimed Drops</Heading>
      {claimedItemsQuery.isLoading ? (
        <Center py={4} w="100%">
          <Flex gap={2} align="center">
            <Spinner size="sm" />
            <Heading fontWeight={300} as="h5" size="xs">
              loading
            </Heading>
          </Flex>
        </Center>
      ) : !claimedItemsQuery.data?.length ? (
        <Center py={4} w="100%">
          <Heading fontWeight="300" size="xs" fontStyle="italic">
            No drops have been claimed yet.
          </Heading>
        </Center>
      ) : (
        <Flex direction="column" gap={2}>
          <SimpleGrid gap={4} columns={{ base: 2, sm: 3, md: 4, lg: 5 }}>
            {claimedItemsQuery.data?.map((item) => (
              <NftDropItem key={item.metadata.id.toString()} item={item} />
            ))}
          </SimpleGrid>
        </Flex>
      )}
    </Flex>
  );
};
