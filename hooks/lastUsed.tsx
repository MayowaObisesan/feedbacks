"use client";

import { useLocalStorage } from "usehooks-ts";
import { Chip } from "@heroui/chip";

export function useLastUsed() {
  return useLocalStorage<"github" | "google" | "email" | undefined>(
    "last_feedback_unkey_login",
    undefined,
  );
}

export const LastUsed: React.FC = () => {
  // return <span className="ml-4 text-xs text-content-subtle">Last used</span>;
  return (
    <Chip color="success" size={"sm"} variant={"shadow"}>
      Last used
    </Chip>
  );
};
