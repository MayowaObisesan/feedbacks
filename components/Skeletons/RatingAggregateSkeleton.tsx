import { LucideStar } from "lucide-react";
import { Progress } from "@heroui/progress";
import React from "react";
import { Skeleton } from "@heroui/skeleton";

import { StarItem } from "@/components/RatingStars/RatingComponent";

export default function RatingAggregateSkeleton() {
  return (
    <div className="flex flex-row gap-8 p-4">
      {/* Left side - Big rating number */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-5xl font-bold">
          0.0
          <span className={"text-xl text-default-400"}> of 3</span>
        </span>
        <div className="flex gap-1 my-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <StarItem
              key={index}
              rating={index + 1}
              selectedRating={Math.round(Math.random() * 10)}
              setSelectedRating={() => null}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">{0} feedbacks</span>
      </div>

      {/* Right side - Rating bars */}
      <div className="flex flex-col justify-center gap-3 flex-1">
        {[1, 2, 3]?.map((item, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="flex flex-row items-center gap-x-1 w-8 text-sm">
              {item}
              <LucideStar color={"lightgray"} fill={"lightgray"} size={12} />
            </span>
            {/*<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${(item.count / totalRatings) * 100}%`,
                }}
              />
            </div>*/}
            <Skeleton className={"rounded-xl w-full"}>
              <Progress
                aria-label="Loading..."
                className="max-w-md"
                value={0}
              />
            </Skeleton>
            <span className="w-12 text-sm text-gray-500">0 %</span>
          </div>
        ))}
      </div>
    </div>
  );
}
