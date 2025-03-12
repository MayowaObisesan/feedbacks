import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import React from "react";
import { Skeleton } from "@nextui-org/skeleton";

export default function TrendingBrandCardSkeleton() {
  return (
    <Card className="min-w-[280px] max-w-[280px] lg:min-w-[360px] h-[200px]">
      <CardBody className="relative flex flex-col justify-center gap-y-2 px-8">
        <Avatar
          isBordered
          className={"absolute top-4 right-4"}
          fallback={<div />}
          radius="full"
          size="md"
          src={""}
        >
          <Skeleton />
        </Avatar>
        <div className="w-3/4 rounded-xl font-normal text-5xl leading-normal text-ellipsis whitespace-nowrap overflow-hidden">
          <Skeleton className={""}>{"rawName"}</Skeleton>
        </div>
        <div
          className={
            "w-5/6 rounded-xl text-sm text-content4-foreground/75 text-ellipsis overflow-hidden whitespace-nowrap"
          }
        >
          <Skeleton>{"description"}</Skeleton>
        </div>
      </CardBody>
      <CardFooter>
        <div className="absolute left-8 bottom-4 font-extrabold text-sm py-4">
          <Skeleton className={"rounded-xl"}>0 Feedbacks</Skeleton>
        </div>
      </CardFooter>
    </Card>
  );
}

export function BrandCardSkeleton() {
  return (
    <Card as={"button"} className="min-w-[280px] lg:min-w-[360px] h-[200px]">
      <CardBody className="flex flex-col justify-center px-8">
        <Skeleton className={"w-5/6 h-12 mt-4 rounded-full"} isLoaded={false}>
          <div className="font-normal text-5xl leading-normal text-ellipsis whitespace-nowrap overflow-hidden">
            &nbsp;
          </div>
        </Skeleton>
      </CardBody>
      <Skeleton className="absolute left-8 bottom-8 w-2/6 h-4 font-extrabold text-sm rounded-full" />
    </Card>
  );
}
