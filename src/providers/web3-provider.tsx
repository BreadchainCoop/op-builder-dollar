"use client";

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { http, WagmiProvider } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "YOUR_PROJECT_ID_HERE";

if (
  !walletConnectProjectId ||
  walletConnectProjectId === "YOUR_PROJECT_ID_HERE"
) {
  console.warn(
    "WalletConnect Project ID not configured. Please set NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID environment variable.",
  );
}

const baseTheme = darkTheme({
  accentColor: "#ff0420",
  accentColorForeground: "#ff0420",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
});

const config = getDefaultConfig({
  appName: "Optimistic Builders Dollar",
  projectId: walletConnectProjectId,
  appDescription: "Optimism Builders Dollar",
  appUrl: "https://obdollar.xyz",
  appIcon: "https://obdollar.xyz/icons/op-icon.ico",
  chains: [optimism, mainnet],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http("https://mainnet.optimism.io"),
  },
});

const graphqlClient = new Client({
  url: "https://optimism.easscan.org/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Provider value={graphqlClient}>
          <RainbowKitProvider modalSize="compact" theme={baseTheme}>
            {children}
          </RainbowKitProvider>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
