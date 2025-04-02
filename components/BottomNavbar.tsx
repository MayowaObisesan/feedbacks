"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { LucideHome, LucideLayoutGrid, LucideLayoutTemplate } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@heroui/theme";

export function TabBottomNavbar() {
  const [activeTab, setActiveTab] = React.useState("home");

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "lucide:home",
      activeIcon: "lucide:home-fill",
    },
    {
      id: "Brands",
      label: "Explore",
      icon: "lucide:search",
      activeIcon: "lucide:search",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "lucide:bell",
      activeIcon: "lucide:bell-ring",
    },
    {
      id: "messages",
      label: "Messages",
      icon: "lucide:mail",
      activeIcon: "lucide:mail",
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Main content area */}
      <main className="flex-1 overflow-auto p-4">
        <h1 className="text-xl font-bold">Current Page: {activeTab}</h1>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-content1 border-t border-divider px-2">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          {navItems.map((item) => (
            <Button
              key={item.id}
              className={`flex-1 flex flex-col items-center gap-1 py-3 min-w-unit-20 ${
                activeTab === item.id ? "text-primary" : "text-default-500"
              }`}
              variant="light"
              onPress={() => setActiveTab(item.id)}
            >
              {/*<Icon
                height={24}
                icon={activeTab === item.id ? item.activeIcon : item.icon}
                width={24}
              />*/}
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>

      {/* Safe area spacing for mobile devices */}
      <div className="h-safe-bottom bg-content1" />
    </div>
  );
}

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <div
      className={
        "grid grid-cols-3 justify-around items-center w-full h-full"
      }
    >
      <Button
        as={Link}
        className={cn(pathname === "/app" ? "font-bold" : "", "text-small")}
        href={"/app"}
        startContent={<LucideHome size={16} strokeWidth={pathname === "/app" ? 2 : 1} />}
        variant={"light"}
      >
        Home
      </Button>
      <Button
        as={Link}
        className={cn(pathname.startsWith("/app/brand") ? "font-bold border-t-2 border-danger rounded-none" : "", "text-small")}
        href={"/app/brand"}
        startContent={<LucideLayoutTemplate size={16} strokeWidth={pathname.startsWith("/app/brand") ? 2 : 1} />}
        variant={"light"}
      >
        Brands
      </Button>
      <Button
        as={Link}
        className={cn(pathname === "/app/category" ? "font-bold" : "", "text-small")}
        href={"/app/category"}
        startContent={<LucideLayoutGrid size={16} strokeWidth={pathname === "/app/category" ? 2 : 1} />}
        variant={"light"}
      >
        Categories
      </Button>
    </div>
  )
}
