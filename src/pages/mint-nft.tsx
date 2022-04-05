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
} from "@chakra-ui/react";
import { useAddress, useNFTCollection, useSDK } from "@thirdweb-dev/react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { MismatchButton } from "../components/mismatch-button";
import { useImageFileOrUrl } from "../hooks/useFileOrUrl";
import { queryClient } from "../queryClient";

function useMintNFTMutation() {
  const address = useAddress();
  const params = useParams();
  const collectionAddress = params.collectionAddress;
  const collection = useNFTCollection(collectionAddress);
  return useMutation(
    async (data: { name: string; description?: string; image?: File }) => {
      if (!collection) {
        throw new Error("no collection ready");
      }
      if (!address) {
        throw new Error("wallet not connected");
      }
      return await collection.mint({ ...data });
    },
    {
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries(["collection", collectionAddress]),
          queryClient.refetchQueries(["collection", collectionAddress]),
        ]);
      },
    }
  );
}

export const MintPage: React.FC = () => {
  const address = useAddress();
  const [image, setImage] = useState<File>();
  const [name, setName] = useState("");
  const [description, setDesctiption] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setImage(acceptedFiles[0]),
    accept: "image/*",
  });

  const imageUrl = useImageFileOrUrl(image);

  const deployMutation = useMintNFTMutation();
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
              navigate("../");
            },
          }
        );
      }}
      direction="column"
      gap={4}
      flexGrow={1}
    >
      <Heading textAlign="center" fontWeight={500} size="sm">
        Mint NFT
      </Heading>
      <Divider borderColor="gray.200" />
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
              borderColor="gray.200"
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
              borderColor="gray.200"
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
              borderColor="gray.200"
              value={description}
              onChange={(e) => setDesctiption(e.currentTarget.value)}
              variant="filled"
            />
          </FormControl>
        </Flex>
      </SimpleGrid>
      <Divider borderColor="gray.200" />
      <MismatchButton
        type="submit"
        isLoading={deployMutation.isLoading}
        loadingText="Minting NFT"
        isDisabled={!address}
        colorScheme="brand"
      >
        Mint
      </MismatchButton>
    </Flex>
  );
};
