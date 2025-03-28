import { useState } from "react";
import { Input } from "@heroui/input";
import { LucideSearch } from "lucide-react";
import { Tab, Tabs } from "@heroui/tabs";

interface BrandFilterProps {
  onFilterChange: (filter: string) => void;
}

export function BrandSearchFilter({ onFilterChange }: BrandFilterProps) {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    onFilterChange(e.target.value);
  };

  return (
    <div className="mb-4 px-2">
      {/*<input
        className="p-2 border border-gray-300 rounded"
        placeholder="Filter brands by name"
        type="text"
        value={filter}
        onChange={handleFilterChange}
      />*/}
      <Input
        placeholder="Filter brands by name"
        size={"md"}
        startContent={<LucideSearch className={"mx-1"} size={16} />}
        type="search"
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  );
}

interface SegmentedFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function SegmentedFilter({
  selectedFilter,
  onFilterChange,
}: SegmentedFilterProps) {
  return (
    <div className="px-2">
      <Tabs
        fullWidth
        aria-label="Brand filters"
        selectedKey={selectedFilter}
        size="sm"
        variant="underlined"
        // @ts-ignore
        onSelectionChange={onFilterChange}
      >
        <Tab key="my_brands" title="My Brands" />
        <Tab key="trending" title="Top Brands" />
        <Tab key="latest" title="Latest Brands" />
        <Tab key="all" title="All Brands" />
      </Tabs>
    </div>
  );
}
