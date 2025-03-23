import "@/styles/globals.css";
import * as React from "react";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
// import Web3ModalProvider from "@/context/wagmi";
import FeedbacksProvider from "@/context";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    // @ts-ignore
    <ClerkProvider>
      <html
        suppressHydrationWarning
        lang="en"
        // data-theme={theme === "light" ? "dark" : "light"}
      >
        <head>
          <title />
        </head>
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          {/*<Web3ModalProvider initialState={initialState}>*/}
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <FeedbacksProvider>
              <div className="relative flex flex-col h-screen">
                <NextTopLoader />
                <Toaster richColors position="top-center" />
                <main className="relative w-full h-dvh overflow-auto mx-auto flex-grow">
                  {/*@ts-ignore*/}
                  <ClerkLoaded>{children}</ClerkLoaded>
                </main>
              </div>
            </FeedbacksProvider>
          </Providers>
          {/*</Web3ModalProvider>*/}
        </body>
      </html>
    </ClerkProvider>
  );
}
