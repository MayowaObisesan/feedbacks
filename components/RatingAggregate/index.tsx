// components/RatingAggregate/index.tsx
import React from "react";
import { Progress } from "@heroui/progress";
import { LucideStar } from "lucide-react";

import { StarItem } from "@/components/RatingStars/RatingComponent";
import { useRealTimeBrands } from "@/hooks/useBrands";
import { useRealTimeFeedbacks } from "@/hooks/useFeedbacks";

interface RatingDistribution {
  rating: number;
  count: number;
}

interface RatingAggregateProps {
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistribution[];
}

export default function RatingAggregate({
  averageRating,
  totalRatings,
  distribution,
}: RatingAggregateProps) {
  useRealTimeBrands();
  useRealTimeFeedbacks();

  return (
    <div className="flex flex-row gap-8 p-4">
      {/* Left side - Big rating number */}
      <div className="flex flex-col items-center justify-center">
        <span className="text-5xl font-bold">
          {averageRating?.toFixed(1)}
          <span className={"text-xl text-default-400"}> of 3</span>
        </span>
        <div className="flex gap-1 my-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <StarItem
              key={index}
              rating={index + 1}
              selectedRating={Math.round(averageRating)}
              setSelectedRating={() => null}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">{totalRatings} ratings</span>
      </div>

      {/* Right side - Rating bars */}
      <div className="flex flex-col justify-center gap-3 flex-1">
        {distribution.map((item, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="flex flex-row items-center gap-x-1 w-8 text-sm">
              {item.rating}
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
            <Progress
              aria-label="Loading..."
              className="max-w-md"
              value={(item.count / totalRatings) * 100}
            />
            <span className="w-12 text-sm text-gray-500">
              {item.count > 0
                ? Math.round((item.count / totalRatings) * 100)
                : 0}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
