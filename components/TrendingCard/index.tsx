"use client";

import { formatCount } from "@/utils";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";

interface ITrendingBrandCard {
  name: string;
  feedbackCount: number;
}

export function TrendingBrandCard({ name, feedbackCount }: ITrendingBrandCard) {
  return (
    <Card className="min-w-[280px] lg:min-w-[360px] h-[200px]" as={"button"}>
      <CardBody className="flex flex-col justify-center px-8">
        <div className="font-normal text-5xl leading-normal text-ellipsis whitespace-nowrap overflow-hidden">
          {name}
        </div>
      </CardBody>
      <div className="absolute left-8 bottom-4 font-extrabold text-sm py-4">
        {formatCount(feedbackCount)} Feedback
      </div>
    </Card>
  );
}

export function TrendingCard() {
  return (
    <Card className="w-[200px] space-y-5 p-4" radius="lg">
      <div className="h-24 rounded-lg bg-default-300"></div>
      <div className="space-y-3">
        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
      </div>
    </Card>
  );
}
