"use client";

import { Skeleton } from "@heroui/skeleton";
import { LucideHome, LucideLayoutTemplate } from "lucide-react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import React, { useMemo, useState } from "react";

import { useBrands, useLatestBrands, useTrendingBrands } from "@/hooks/useBrands";
import { SegmentedFilter } from "@/components/BrandFilter";
import { BrandListCard } from "@/components/BrandCard/BrandListCard";
import { useUserAndUserDBQuery } from "@/hooks/useFeedbackUser";
// import { PageHeader } from "@/components/PageHeader";

// Constants for filter options
const BRAND_FILTERS = {
  ALL: "all",
  LATEST: "latest",
  TRENDING: "trending",
  MY_BRANDS: "my_brands",
} as const;

type BrandFilterType = (typeof BRAND_FILTERS)[keyof typeof BRAND_FILTERS];

export default function BrandsPage() {
  const { data: userAndUserDB } = useUserAndUserDBQuery();
  const { myBrands } = userAndUserDB || {};

  const { data: brands, isLoading } = useBrands(30);
  const { data: latestBrands, isLoading: latestBrandsLoading } =
    useLatestBrands(30);
  const { data: trendingBrands, isLoading: trendingBrandsLoading } =
    useTrendingBrands(30);
  // const [filter, setFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<BrandFilterType>(
    BRAND_FILTERS.MY_BRANDS,
  );

  /*const filteredBrands = brands?.filter((brand) => {
    // First apply the search filter
    const matchesSearch = brand.raw_name.toLowerCase().includes(filter.toLowerCase());

    // Then apply the category filter
    switch (categoryFilter) {
      case BRAND_FILTERS.LATEST:
        // Filter brands created in the last 7 days
        return matchesSearch && new Date(brand.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      case BRAND_FILTERS.TRENDING:
        // Filter brands with the most feedback_count
        return matchesSearch && brand?.feedback_count! > 10;
      case BRAND_FILTERS.MY_BRANDS:
        // Filter brands that the user follows
        return matchesSearch && brand.is_following;
      default:
        return matchesSearch;
    }
  });*/

  // Determine which dataset to use based on the category filter
  const currentBrands = useMemo(() => {
    switch (categoryFilter) {
      case BRAND_FILTERS.LATEST:
        return latestBrands;
      case BRAND_FILTERS.TRENDING:
        return trendingBrands;
      case BRAND_FILTERS.MY_BRANDS:
        return myBrands;
      default:
        return brands;
    }
  }, [categoryFilter, brands, trendingBrands, latestBrands, myBrands]);

  // Apply search filter to the selected dataset
  // const filteredBrands = currentBrands?.filter((brand) =>
  //   brand.raw_name.toLowerCase().includes(filter.toLowerCase()),
  // );

  const isLoadingBrands = isLoading || latestBrandsLoading;

  return (
    <div className="w-full lg:max-w-7xl mx-auto">
      <div className={"max-md:hidden sticky top-0 z-40 p-4 bg-background"}>
        <Breadcrumbs>
          <BreadcrumbItem
            key={"home"}
            href={"/app"}
            startContent={<LucideHome size={15} />}
          >
            Home
          </BreadcrumbItem>
          <BreadcrumbItem
            key={"brands"}
            startContent={<LucideLayoutTemplate size={15} />}
          >
            Brands
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <div className="sticky top-0 space-y-4">
        {/*<BrandSearchFilter onFilterChange={setFilter} />*/}
        <SegmentedFilter
          selectedFilter={categoryFilter}
          onFilterChange={(filter) =>
            setCategoryFilter(filter as BrandFilterType)
          }
        />
        {/*<BrandSearchFilter onFilterChange={setFilter} />*/}
      </div>

      {/*<PageHeader
        subtitle="View and interact with all available brands"
        title="Brands"
      />*/}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 px-0">
        {isLoadingBrands
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-lg" />
            ))
          : currentBrands?.map((brand) => (
              /*<Card
              key={brand.id}
              isPressable
              className="p-4"
              onPress={() => router.push(`/app/brand/${brand.name}`)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <Avatar
                    name={brand.raw_name}
                    size="lg"
                    src={brand.brand_image!}
                  />
                </div>
                <div className={"text-left"}>
                  <h3 className="text-lg font-semibold">{brand.raw_name}</h3>
                  <p className="text-sm text-default-500">
                    {brand.description?.substring(0, 100)}
                    {brand.description?.length! > 100 ? "..." : ""}
                  </p>
                </div>
              </div>
            </Card>*/
              <BrandListCard
                key={brand.name}
                avatarUrl={brand.brand_image!}
                description={brand.description!}
                feedbackCount={brand.feedback_count!}
                isLoading={isLoading}
                name={brand.name}
                rawName={brand.raw_name}
              />
            ))}
      </div>
    </div>
  );
}
