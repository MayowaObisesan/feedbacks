// config/index.tsx

/*import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia, base, baseSepolia } from "wagmi/chains";*/

// Your WalletConnect Cloud project ID
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

if (!projectId) {
  throw new Error("No PROJECT ID provided");
}

// Create a metadata object
const metadata = {
  name: "Feedback",
  description: "AppKit Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
// const chains = [mainnet, sepolia, base, baseSepolia] as const;

/*export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: true, // default to true
    socials: [
      "google",
      "github",
      "x",
      "discord",
      "apple",
      "facebook",
      "farcaster",
    ],
    showWallets: false, // default to true
    walletFeatures: true, // default to true
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  //   ...wagmiOptions, // Optional - Override createConfig parameters
});*/
