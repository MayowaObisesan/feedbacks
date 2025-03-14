import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { LucideStar } from "lucide-react";

export function FeedbackCardSkeleton() {
  return (
    <Card
      className="min-w-[280px] lg:min-w-[360px] w-[280px] space-y-5 p-4"
      radius="lg"
    >
      <div className="max-w-[300px] w-full flex items-center gap-3">
        <div>
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        {Math.round(Math.random()) > 0 && (
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        )}
      </div>
      <div className={"flex flex-row gap-x-2"}>
        {Array.from({ length: 2 + Math.round(Math.random()) }).map(
          (_, index) => (
            <LucideStar
              key={index}
              className={"text-default-200"}
              fill={"currentColor"}
              size={24}
            />
          ),
        )}
      </div>
    </Card>
  );
}

export function FeedbackCardListSkeleton() {
  return (
    <Card className="w-full space-y-5 p-4" radius="lg">
      <div className="max-w-[300px] w-full flex items-center gap-3">
        <div>
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        {Math.round(Math.random()) > 0 && (
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        )}
      </div>
      <div className={"flex flex-row gap-x-2"}>
        {Array.from({ length: 2 + Math.round(Math.random()) }).map(
          (_, index) => (
            <LucideStar
              key={index}
              className={"text-default-200"}
              fill={"currentColor"}
              size={24}
            />
          ),
        )}
      </div>
    </Card>
  );
}
