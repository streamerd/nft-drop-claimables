import {
  AspectRatio,
  Button,
  ButtonGroup,
  chakra,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { ThirdwebNftMedia, useNFTDrop } from "@thirdweb-dev/react";
import { NFTMetadataOwner } from "@thirdweb-dev/sdk";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";

const ChakraThirdwebNftMedia = chakra(ThirdwebNftMedia);

export const NftDropItem: React.FC<{
  item: NFTMetadataOwner;
  canBeClaimed?: true;
}> = ({ item, canBeClaimed }) => {
  const params = useParams();
  const drop = useNFTDrop(params.dropAddress);

  const claim = useMutation(async () => {
    if (!drop) {
      throw new Error("no item ready");
    }
    return await drop.claim(1);
  });
  return (
    <Flex
      flexDir="column"
      w="100%"
      borderRadius="md"
      borderWidth={1}
      p={2}
      gap={2}
    >
      <AspectRatio ratio={1}>
        <ChakraThirdwebNftMedia
          bgColor="gray.100"
          metadata={item.metadata}
          requireInteraction
          flexShrink={0}
          objectFit="contain"
          borderRadius="md"
        />
      </AspectRatio>
      <Heading size="xs">{item.metadata.name}</Heading>
      <Text fontSize="sm" noOfLines={3}>
        {item.metadata.description}
      </Text>
      <Divider mt="auto" />
      {canBeClaimed ? (
        <ButtonGroup w="full" colorScheme="brand" size="sm">
          {/* <Button variant="ghost">Transfer</Button> */}
          <Button
            onClick={() => claim.mutate()}
            isLoading={claim.isLoading}
            flexGrow={1}
          >
            Claim
          </Button>
        </ButtonGroup>
      ) : (
        <ButtonGroup w="full" colorScheme="brand" size="sm">
          <Button variant="ghost">Transfer</Button>
          <Button flexGrow={1}>Sell</Button>
        </ButtonGroup>
      )}
    </Flex>
  );
};
