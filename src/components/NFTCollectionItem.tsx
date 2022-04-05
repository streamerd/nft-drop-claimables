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
import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { NFTMetadataOwner } from "@thirdweb-dev/sdk";

const ChakraThirdwebNftMedia = chakra(ThirdwebNftMedia);

export const NftCollectionItem: React.VFC<{ item: NFTMetadataOwner }> = ({
  item,
}) => {
  return (
    <Flex
      flexDir="column"
      w="100%"
      borderRadius="md"
      borderWidth={1}
      borderColor="gray.200"
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
      <Divider mt="auto" borderColor="gray.200" />
      <ButtonGroup w="full" colorScheme="brand" size="sm">
        <Button variant="ghost">Transfer</Button>
        <Button flexGrow={1}>Sell</Button>
      </ButtonGroup>
    </Flex>
  );
};
