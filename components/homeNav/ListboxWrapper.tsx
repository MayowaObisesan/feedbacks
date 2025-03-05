import React from "react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

export const ListboxWrapper = ({ children }: { children: any }) => (
  <ScrollShadow hideScrollBar={false} className="relative flex flex-row items-stretch place-items-stretch flex-grow shrink-0 w-full h-full min-w-[260px] px-1 py-2 rounded-small ">
    <div>
      {children}
    </div>
  </ScrollShadow>
);
