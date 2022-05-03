import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  IconButton,
  Link,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import React, { createContext, useContext, useMemo, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const explainMap = {
  mint: {
    title: "Mint a new NFT",
    snippet: `
// Custom metadata of the NFT
const metadata = {
  name: "Cool NFT",
  description: "This is a cool NFT",
  // This can be an image url or file
  image: fs.readFileSync("path/to/image.png"),
};

const tx = await collection.mint(metadata);
    `,
    docLink: "https://docs.thirdweb.com/typescript/sdk.nftcollection.mint",
  },
  "create-collection": {
    title: "Create a new NFT collection",
    snippet: `
// Custom metadata of the NFT collection
const contractMetadata = {
  name: "Cool NFT Collection",
  description: "This is a cool NFT Collection",
  // This can be an image url or file
  image: fs.readFileSync("path/to/image.png"),
};
    
const contractAddress = await sdk.deployer.deployNFTCollection(contractMetadata);
    `,
    docLink:
      "https://docs.thirdweb.com/typescript/sdk.contractdeployer.deploynftcollection",
  },
  "get-collections": {
    title: "Get all NFT collections of a wallet",
    snippet: `
// get all contracts owned by a given wallet
const contracts = await sdk.getContractList(walletAddress);

//filter out only NFT collections
const nftContracts = contracts.filter((c) => c.contractType === "nft-collection");
    `,
    docLink:
      "https://docs.thirdweb.com/typescript/sdk.thirdwebsdk.getcontractlist#thirdwebsdkgetcontractlist-method",
  },
  "get-collection-items": {
    title: "Get all NFTs of a collection",
    snippet: `const nfts = await collection.getAll();
console.log(nfts);`,
    docLink: "https://docs.thirdweb.com/typescript/sdk.erc721.getall",
  },
};

type ExplainId = keyof typeof explainMap;

const DemoContext = createContext({
  explainId: undefined as ExplainId | undefined,
  setExplainId: (id: ExplainId) => undefined as void,
});

export const DemoProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [explainId, setExplainId] = useState<ExplainId | undefined>(undefined);

  const data = useMemo(() => {
    return explainId
      ? explainMap[explainId]
      : {
          title: "",
          snippet: "",
          docLink: "",
        };
  }, [explainId]);

  return (
    <DemoContext.Provider value={{ explainId, setExplainId }}>
      <Drawer
        isOpen={!!explainId}
        onClose={() => setExplainId(undefined)}
        placement="right"
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{data.title}</DrawerHeader>

          <DrawerBody>
            <SyntaxHighlighter language="javascript" style={docco}>
              {data.snippet}
            </SyntaxHighlighter>
            <Heading mt={4} size="sm">
              Learn more
            </Heading>
            <UnorderedList>
              <ListItem>
                <Link isExternal href={data.docLink}>
                  Docs
                </Link>
              </ListItem>
            </UnorderedList>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {children}
    </DemoContext.Provider>
  );
};

export function useDemoContext() {
  return useContext(DemoContext);
}

export const ExplainButton: React.VFC<{ explainId: ExplainId }> = ({
  explainId,
}) => {
  const ctx = useDemoContext();
  return (
    <IconButton
      w="auto"
      variant="ghost"
      onClick={() => ctx.setExplainId(explainId)}
      aria-label="explain"
      icon={<QuestionOutlineIcon />}
    />
  );
};
