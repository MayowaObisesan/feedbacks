import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import SearchModal from "@/components/Modals/SearchModal";
import MobileDrawer from "@/components/MobileDrawer";
import { BottomNavbar } from "@/components/BottomNavbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/feedbacks.png",
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
  return (
    <div className="relative flex flex-col w-full h-dvh">
      {/*<div className={"sticky top-0 bg-teal-900 p-4"}>*/}
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      {/*</div>*/}
      <SearchModal />
      <MobileDrawer />
      <div className="relative w-full h-full overflow-auto mx-auto flex-grow">
        {/*<ModalContainer />*/}
        {children}
      </div>
      <div className={"w-full h-16"}>
        <BottomNavbar />
      </div>
      {/*<footer className="w-full flex items-center justify-center py-3">
          Footer 2
        </footer>*/}
    </div>
  );
}
