import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import { Buffer } from "buffer";
import { ChakraProvider } from "@chakra-ui/react";
if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

import chakraTheme from "./theme";
import { CreateCollectionPage } from "./pages/create-collection";
import { CollectionPage } from "./pages/collection";
import { MintPage } from "./pages/mint-nft";
import { CollectionOverviewPage } from "./pages/collection-overview";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./queryClient";

// This is the chainId your dApp will work on.
export const activeChainId = ChainId.Polygon;

const element = document.getElementById("root") as HTMLElement;
const root = createRoot(element);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={chakraTheme}>
        <ThirdwebProvider desiredChainId={activeChainId}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="/create" element={<CreateCollectionPage />} />
                <Route
                  path="/:collectionAddress"
                  element={<CollectionOverviewPage />}
                >
                  <Route index element={CollectionPage} />
                  <Route
                    path="/:collectionAddress/mint"
                    element={<MintPage />}
                  />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ThirdwebProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
