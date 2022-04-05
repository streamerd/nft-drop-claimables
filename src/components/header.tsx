import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import {
  useAddress,
  useDisconnect,
  useCoinbaseWallet,
} from "@thirdweb-dev/react";
import { Link } from "react-router-dom";
import { shortenIfAddress } from "../utils/address";

export const Header: React.VFC = () => {
  const address = useAddress();
  const connectCoinbaseWallet = useCoinbaseWallet();
  const disconnectWallet = useDisconnect();

  return (
    <Box
      position="sticky"
      top={0}
      bg="white"
      as="header"
      py={2}
      borderBottomWidth={1}
    >
      <Container
        maxW="container.lg"
        as={Flex}
        justify="space-between"
        align="center"
      >
        <Link to="/">
          <Heading as="h1" fontWeight={500} fontSize="2xl" color="brand.500">
            acme inc.
          </Heading>
        </Link>
        {address ? (
          <Button
            size="sm"
            variant="outline"
            colorScheme="brand"
            onClick={disconnectWallet}
          >
            {shortenIfAddress(address)}
          </Button>
        ) : (
          <Button
            size="sm"
            colorScheme="brand"
            onClick={() => connectCoinbaseWallet()}
          >
            Connect Wallet
          </Button>
        )}
      </Container>
    </Box>
  );
};
