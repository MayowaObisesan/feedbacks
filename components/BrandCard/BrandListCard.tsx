import { Card } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { formatCount } from "@/utils";
import React from "react";
import { IBrandCard } from "@/types";

interface IBrandCardWithLoading extends IBrandCard {
  isLoading: boolean;
}

export function BrandListCard(
  {
    isLoading,
    name,
    rawName,
    avatarUrl,
    description,
    feedbackCount
  }: IBrandCardWithLoading) {
  return (
    <Card
      fullWidth={true}
      className="flex flex-row h-20"
      as={"a"}
      isPressable
      href={`/app/brand/${name}`}
    >
      <div className="relative flex flex-row justify-start items-center gap-x-4 px-4 w-full">
        <Avatar
          isBordered
          radius="full"
          size="md"
          src={avatarUrl}
          className={"grow shrink-0"}
          fallback={"B"}
        />
        <section className={"flex flex-col w-full overflow-x-auto"}>
          <div className="font-medium text-medium leading-snug text-ellipsis whitespace-nowrap overflow-hidden">
            {rawName}
          </div>
          <div
            className={"text-small text-content4-foreground/75 text-ellipsis overflow-hidden whitespace-nowrap"}>
            {description}
          </div>
          <div className="font-medium text-xs leading-normal">
            {Number(formatCount(feedbackCount))} {feedbackCount > 0 ? "Feedbacks" : "Feedback"}
          </div>
        </section>
      </div>
    </Card>
  );
}
