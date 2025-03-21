import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { Spacer } from "@heroui/spacer";
import { Button } from "@heroui/button";

import { DotSpacer } from "@/components/TextSkeleton";

export function BrandNavSkeleton() {
  return (
    <Card
      className="max-sm:grid max-sm:grid-cols-3 lg:grid-cols-none py-0 bg-default-50/80 dark:bg-default-50 shadow-none"
      isPressable={false}
    >
      <CardBody className="overflow-visible px-2">
        <Skeleton className="flex rounded-xl size-32 lg:w-60 lg:h-72" />
      </CardBody>
      <CardHeader className="pb-0 px-4 flex-col max-sm:col-span-2 items-start gap-y-2">
        {/* <p className="text-tiny uppercase font-bold">Brand Details</p> */}
        {/* <small className="text-default-500">12 Tracks</small> */}
        <Skeleton className="h-8 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-11/12 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
        <div className="flex items-center gap-1 py-2">
          <Skeleton className="h-3 w-20 rounded-lg" />
          <DotSpacer />
          <Skeleton className="h-3 w-20 rounded-lg" />
        </div>
        <Spacer y={2} />
        <div className={"px-0"}>
          <Skeleton className={"rounded-xl"}>
            <Button color={"danger"} variant={"solid"}>
              Unfollow
            </Button>
          </Skeleton>
        </div>
        <Spacer y={4} />
      </CardHeader>
    </Card>
  );
}
