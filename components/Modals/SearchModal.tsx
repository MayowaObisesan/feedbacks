import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { PostgrestError } from "@supabase/supabase-js";
import { Skeleton } from "@nextui-org/skeleton";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Alert } from "@heroui/alert";

import { capitalize } from "@/utils";
import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";
import { IBrands } from "@/types";
import { BrandListCard } from "@/components/BrandCard/BrandListCard";
import EmptyCard from "@/components/EmptyCard";
import { SearchIcon } from "@/components/icons";

export default function SearchModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<IBrands[]>([]);
  const [error, setError] = useState<PostgrestError>();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setIsSearching(true);
  };

  useEffect(() => {
    const searchBrands = async () => {
      let results: IBrands[] = [];

      if (debouncedSearchTerm) {
        // const data = await searchHackerNews(debouncedSearchTerm);
        let { data, error } = await supabase
          .from(DBTables.Brand)
          .select("*")
          // Filters
          // .eq('column', 'Equal to')
          .ilike("name", `%${debouncedSearchTerm}%`)
          .range(0, 9);

        if (error) {
          setError(error);
        }

        results = data || [];
      }

      setIsSearching(false);
      setResults(results);
    };

    searchBrands();
  }, [debouncedSearchTerm]);

  return (
    <div className={""}>
      {error && <Alert />}
      <div className="flex flex-wrap gap-3">
        <Button
          isIconOnly
          id={"id-search-modal"}
          radius={"full"}
          variant={"flat"}
          onPress={onOpen}
        >
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        </Button>
      </div>

      <Modal
        classNames={{
          base: "max-h-full",
          body: "px-2 my-0",
          closeButton: "text-3xl font-bold my-0.5",
        }}
        isOpen={isOpen}
        placement={"center"}
        scrollBehavior={"inside"}
        size={"full"}
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Search across feedbacks
              </ModalHeader>
              <ModalBody>
                <Input
                  aria-label="Search"
                  classNames={{
                    inputWrapper: "bg-default-100",
                    input: "text-sm",
                  }}
                  endContent={
                    <Kbd className="hidden lg:inline-block" keys={["command"]}>
                      K
                    </Kbd>
                  }
                  labelPlacement="outside"
                  placeholder="Search across feedbacks ..."
                  size={"lg"}
                  startContent={
                    <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  type="search"
                  onValueChange={handleSearch}
                />

                <div className={"flex flex-row items-center gap-x-4"}>
                  {["brands", "category"].map((eachSearchFilter) => (
                    <Chip
                      key={eachSearchFilter}
                      isCloseable
                      radius={"md"}
                      size={"lg"}
                      variant={"flat"}
                    >
                      {capitalize(eachSearchFilter)}
                    </Chip>
                  ))}
                </div>

                <ScrollShadow>
                  <div className={"flex flex-col gap-y-2 px-1 py-2"}>
                    {isSearching &&
                      searchTerm.length > 0 &&
                      Array.from({ length: 4 }).map((eachItem) => (
                        <Skeleton
                          key={eachItem as number}
                          className="rounded-xl"
                        >
                          <div className="h-20 rounded-xl bg-default-100" />
                        </Skeleton>
                      ))}

                    {!isSearching &&
                      searchTerm.length > 0 &&
                      results.length > 0 &&
                      results.map((eachItem) => (
                        <BrandListCard
                          key={eachItem.name}
                          avatarUrl={eachItem.brandImage}
                          description={eachItem.description}
                          feedbackCount={eachItem.feedbackCount}
                          isLoading={isSearching}
                          name={eachItem.name}
                          rawName={eachItem.rawName}
                        />
                      ))}

                    {!isSearching &&
                      searchTerm.length > 0 &&
                      results.length === 0 && (
                        <EmptyCard>
                          <div className={"text-lg text-content4"}>
                            No brand match your search
                          </div>
                        </EmptyCard>
                      )}

                    {searchTerm.length === 0 && (
                      <div
                        className={
                          "flex flex-col justify-center items-center h-96 w-full text-foreground-400"
                        }
                      >
                        What do you want to search for?
                      </div>
                    )}
                  </div>
                </ScrollShadow>
              </ModalBody>
              {/*<ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>*/}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
