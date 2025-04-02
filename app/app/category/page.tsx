"use client";

import { ScrollShadow } from "@heroui/scroll-shadow";
import React from "react";
import { Link } from "@heroui/link";

import { categoryListObject } from "@/constant";

export default function CategoryPage() {
  return (
    <div className={"flex flex-col gap-y-2 w-full"}>
      <header className={"sticky top-0 z-10 space-y-2 px-2 py-2 bg-background"}>
        <div className={"font-bold text-2xl"}>Categories</div>
        <div className={"font-medium text-small text-foreground-500"}>
          Connect with brands in these categories
        </div>
      </header>
      <ScrollShadow hideScrollBar orientation={"vertical"}>
        <div className="flex flex-col gap-8 px-2 py-4">
          {categoryListObject().map((eachCategory) => (
            <Link
              key={eachCategory.name.toLowerCase()}
              className={"text-left"}
              color={"foreground"}
              size={"md"}
            >
              {eachCategory.name}
            </Link>
          ))}
        </div>
      </ScrollShadow>
    </div>
  );
}
