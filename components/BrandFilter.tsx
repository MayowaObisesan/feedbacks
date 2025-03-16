import { useState } from "react";
import { Input } from "@heroui/input";
import { LucideSearch } from "lucide-react";

interface BrandFilterProps {
  onFilterChange: (filter: string) => void;
}

export default function BrandFilter({ onFilterChange }: BrandFilterProps) {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    onFilterChange(e.target.value);
  };

  return (
    <div className="mb-4">
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
