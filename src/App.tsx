import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
} from "@chakra-ui/react";
import {
  useAddress,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { Outlet } from "react-router-dom";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { activeChainId } from "./main";

function App() {
  const address = useAddress();

  const isMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  return (
    <Flex direction="column" minH="100vh">
      <Header />
      {!address ? (
        <Box w="100%">
          <Alert colorScheme="brand" variant="solid">
            <AlertIcon />
            <AlertTitle>No wallet</AlertTitle>
            <AlertDescription>
              Please connect your wallet to interact with this dApp.
            </AlertDescription>
          </Alert>
        </Box>
      ) : isMismatch ? (
        <Box w="100%">
          <Alert colorScheme="brand" variant="solid">
            <AlertIcon />
            <AlertTitle>Incorrect Network</AlertTitle>
            <AlertDescription>
              Your wallet is connected to an unsupported network.
            </AlertDescription>
            {switchNetwork && (
              <Button
                onClick={() => switchNetwork(activeChainId)}
                ml="auto"
                size="sm"
                colorScheme="whiteAlpha"
              >
                Switch Networks
              </Button>
            )}
          </Alert>
        </Box>
      ) : null}
      <Box as="main" flexGrow={1} py={2}>
        <Container maxW="container.lg">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
}

export default App;
