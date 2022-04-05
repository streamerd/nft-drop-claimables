import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";

export const Footer: React.VFC = () => {
  return (
    <Box bg="white" as="header" py={2} borderTopWidth={1}>
      <Container
        maxW="container.lg"
        as={Flex}
        justify="space-between"
        align="center"
      >
        <Heading fontWeight={500} fontSize="2xl" color="brand.500">
          acme inc.
        </Heading>
      </Container>
    </Box>
  );
};
