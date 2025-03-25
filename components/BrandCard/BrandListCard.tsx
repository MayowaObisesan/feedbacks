import { Card } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import React from "react";

import { formatCount } from "@/utils";
import { IBrandCard } from "@/types";

interface IBrandCardWithLoading extends IBrandCard {
  isLoading: boolean;
}

export function BrandListCard({
  name,
  rawName,
  avatarUrl,
  description,
  feedbackCount,
}: IBrandCardWithLoading) {
  return (
    <Card
      isPressable
      as={"a"}
      className="flex flex-row h-20"
      fullWidth={true}
      href={`/app/brand/${name}`}
    >
      <div className="relative flex flex-row justify-start items-center gap-x-4 px-4 w-full">
        <Avatar
          isBordered
          className={"grow shrink-0"}
          fallback={"B"}
          radius="full"
          size="md"
          src={avatarUrl}
        />
        <section className={"flex flex-col w-full overflow-x-auto"}>
          <div className="font-medium text-medium leading-snug text-ellipsis whitespace-nowrap overflow-hidden">
            {rawName}
          </div>
          <div
            className={
              "text-small text-content4-foreground/75 text-ellipsis overflow-hidden whitespace-nowrap"
            }
          >
            {description}
            {/*{description?.substring(0, 100)}*/}
            {/*{description?.length! > 100 ? "..." : ""}*/}
          </div>
          <div className="font-medium text-xs leading-normal">
            {Number(formatCount(feedbackCount))}{" "}
            {feedbackCount > 0 ? "Feedbacks" : "Feedback"}
          </div>
        </section>
      </div>
    </Card>
  );
}
