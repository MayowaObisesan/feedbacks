"use client";

import { Card } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { useRouter } from "next/navigation";
import { LucideHome, LucideLayoutTemplate } from "lucide-react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { useState } from "react";

import { useBrands } from "@/hooks/useBrands";
import BrandFilter from "@/components/BrandFilter";
// import { PageHeader } from "@/components/PageHeader";

export default function BrandsPage() {
  const router = useRouter();
  const { data: brands, isLoading } = useBrands();
  const [filter, setFilter] = useState<string>("");

  const filteredBrands = brands?.filter((brand) =>
    brand.raw_name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className={"sticky top-0 z-40 p-4 bg-background"}>
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

      <BrandFilter onFilterChange={setFilter} />

      {/*<PageHeader
        subtitle="View and interact with all available brands"
        title="Brands"
      />*/}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-lg" />
            ))
          : filteredBrands?.map((brand) => (
              <Card
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
              </Card>
            ))}
      </div>
    </div>
  );
}
