import React from "react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { cn } from "@heroui/theme";

export const ListboxWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: any;
}) => (
  <ScrollShadow
    className={cn(
      "relative flex flex-row items-stretch place-items-stretch flex-grow shrink-0 w-full h-full min-w-[260px] px-1 py-2 rounded-small",
      className,
    )}
    hideScrollBar={false}
  >
    <div className={"w-full"}>{children}</div>
  </ScrollShadow>
);
