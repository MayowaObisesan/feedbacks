"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import Link from "next/link";
import React from "react";
import { Avatar } from "@heroui/avatar";

import { formatCount } from "@/utils";
import { ITrendingBrandCard } from "@/types";

export function TrendingBrandCard({
  name,
  rawName,
  avatarUrl,
  description,
  feedbackCount,
}: ITrendingBrandCard) {
  return (
    <Link href={`/app/brand/${name}`}>
      <Card
        isPressable
        as={"button"}
        className="min-w-[280px] max-w-[280px] lg:min-w-[360px] h-[200px]"
      >
        <CardBody className="relative flex flex-col justify-center px-8">
          <Avatar
            isBordered
            className={"absolute top-4 right-4"}
            radius="full"
            size="md"
            src={avatarUrl}
          />
          <div className="font-medium text-3xl lg:text-5xl leading-normal text-ellipsis whitespace-nowrap overflow-hidden">
            {rawName}
          </div>
          <div
            className={
              "text-sm text-content4-foreground/75 text-ellipsis overflow-hidden whitespace-nowrap"
            }
          >
            {description}
          </div>
        </CardBody>
        <CardFooter>
          <div className="absolute left-8 bottom-4 font-extrabold text-sm py-4">
            {Number(formatCount(feedbackCount))}{" "}
            {feedbackCount > 0 ? "Feedbacks" : "Feedback"}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function TrendingCard() {
  return (
    <Card className="w-[200px] space-y-5 p-4" radius="lg">
      <div className="h-24 rounded-lg bg-default-300" />
      <div className="space-y-3">
        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        <div className="h-3 w-2/5 rounded-lg bg-default-300" />
      </div>
    </Card>
  );
}
