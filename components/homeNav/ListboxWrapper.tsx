import React from "react";
export const ListboxWrapper = ({ children }: { children: any }) => (
  <div className="flex flex-row items-stretch place-items-stretch flex-grow shrink-0 w-full h-full min-w-[260px] max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
