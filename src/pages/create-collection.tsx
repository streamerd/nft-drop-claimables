import {
  AspectRatio,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Textarea,
  Text,
  Button,
} from "@chakra-ui/react";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { MismatchButton } from "../components/mismatch-button";
import { useImageFileOrUrl } from "../hooks/useFileOrUrl";
import { queryClient } from "../queryClient";

function useDeployCollectionMutation() {
  const address = useAddress();
  const sdk = useSDK();
  return useMutation(
    async (data: { name: string; description?: string; image?: File }) => {
      if (!sdk) {
        throw new Error("no sdk initialized");
      }
      if (!address) {
        throw new Error("wallet not connected");
      }
      return await sdk.deployer.deployNFTCollection({
        ...data,
        primary_sale_recipient: address,
      });
    },
    {
      onSuccess: () => {
        return queryClient.refetchQueries(["collections"]);
      },
    }
  );
}

export const CreateCollectionPage: React.FC = () => {
  const address = useAddress();
  const [image, setImage] = useState<File>();
  const [name, setName] = useState("");
  const [description, setDesctiption] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setImage(acceptedFiles[0]),
    accept: "image/*",
  });

  const imageUrl = useImageFileOrUrl(image);

  const deployMutation = useDeployCollectionMutation();
  const navigate = useNavigate();

  return (
    <Flex
      as="form"
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        deployMutation.mutate(
          { name, description, image },
          {
            onSuccess: () => {
              navigate("/");
            },
          }
        );
      }}
      direction="column"
      gap={4}
      flexGrow={1}
    >
      <Heading textAlign="center" fontWeight={500} size="sm">
        Create Collection
      </Heading>
      <Divider />
      <SimpleGrid placeItems="center" columns={{ base: 1, md: 2 }} gap={4}>
        <FormControl maxW="300px">
          <AspectRatio ratio={1} w="100%">
            <Center
              bg={imageUrl ? `url(${imageUrl})` : undefined}
              borderRadius="md"
              {...getRootProps()}
              bgColor="gray.100"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              backgroundSize="contain"
              borderWidth={1}
            >
              <input {...getInputProps()} />
              {!imageUrl && (
                <Text fontSize="sm" fontWeight={300}>
                  {isDragActive ? "Drop here..." : "Cover Image"}
                </Text>
              )}
            </Center>
          </AspectRatio>
        </FormControl>
        <Flex direction="column" gap={4} w="100%">
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight={300}>
              Name
            </FormLabel>
            <Input
              borderWidth={1}
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              variant="filled"
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight={300}>
              Description
            </FormLabel>
            <Textarea
              borderWidth={1}
              value={description}
              onChange={(e) => setDesctiption(e.currentTarget.value)}
              variant="filled"
            />
          </FormControl>
        </Flex>
      </SimpleGrid>
      <Divider />
      <MismatchButton
        type="submit"
        isLoading={deployMutation.isLoading}
        loadingText="Creating Collection"
        isDisabled={!address}
        colorScheme="brand"
      >
        Create
      </MismatchButton>
    </Flex>
  );
};
