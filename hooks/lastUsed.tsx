"use client";

import { useLocalStorage } from "usehooks-ts";
import { Chip } from "@nextui-org/chip";

export function useLastUsed() {
  return useLocalStorage<"github" | "google" | "email" | undefined>(
    "last_feedback_unkey_login",
    undefined
  );
}

export const LastUsed: React.FC = () => {
  // return <span className="ml-4 text-xs text-content-subtle">Last used</span>;
  return <Chip variant={"shadow"} color="success" size={"sm"}>Last used</Chip>;
};
