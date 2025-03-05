import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { config } from "@/config";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico"
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ]
};

export default function RootLayout(
  {
    children
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="relative w-full h-full overflow-auto mx-auto flex-grow">
        {children}
      </main>
      {/*<footer className="w-full flex items-center justify-center py-3">
          Footer 2
        </footer>*/}
    </div>
  );
}
