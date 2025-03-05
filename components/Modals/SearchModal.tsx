import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { SearchIcon } from "@/components/icons";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { capitalize } from "@/utils";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";
import { PostgrestError } from "@supabase/supabase-js";
import { IBrands } from "@/types";
import { Skeleton } from "@nextui-org/skeleton";
import { BrandListCard } from "@/components/BrandCard/BrandListCard";
import EmptyCard from "@/components/EmptyCard";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

const brandData = [
  {
    name: "summaryai",
    rawName: "SummaryAI",
    brandImage: "",
    description: "This is a test description",
    feedbackCount: 10
  },
  {
    name: "nine",
    rawName: "Nine",
    brandImage: "",
    description: "This is a test description 2",
    feedbackCount: 5
  },
  {
    name: "walletpro",
    rawName: "WalletPro",
    brandImage: "",
    description: "This is a test description 3",
    feedbackCount: 4
  },
  {
    name: "feedbacks",
    rawName: "Feedbacks",
    brandImage: "",
    description: "This is feedbacks Feedbacks Page",
    feedbackCount: 100
  }
];
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
      <div className="flex flex-wrap gap-3">
        <Button id={"id-search-modal"} variant={"flat"} isIconOnly radius={"full"} onPress={onOpen}>
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        </Button>
      </div>

      <Modal size={"full"} placement={"center"} scrollBehavior={"inside"} isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange}
             classNames={{
               base: "max-h-full",
               body: "px-2 my-0",
               closeButton: "text-3xl font-bold my-0.5"
             }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Search across feedbacks</ModalHeader>
              <ModalBody>
                <Input
                  aria-label="Search"
                  classNames={{
                    inputWrapper: "bg-default-100",
                    input: "text-sm"
                  }}
                  endContent={
                    <Kbd className="hidden lg:inline-block" keys={["command"]}>
                      K
                    </Kbd>
                  }
                  size={"lg"}
                  labelPlacement="outside"
                  placeholder="Search across feedbacks ..."
                  startContent={
                    <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  type="search"
                  onValueChange={handleSearch}
                />

                <div className={"flex flex-row items-center gap-x-4"}>
                  {
                    ["brands", "category"].map(eachSearchFilter => (
                      <Chip size={"lg"} radius={"md"} isCloseable variant={"flat"}>
                        {capitalize(eachSearchFilter)}
                      </Chip>
                    ))
                  }
                </div>

                <ScrollShadow>
                  <div className={"flex flex-col gap-y-2 px-1 py-2"}>
                    {
                      isSearching && searchTerm.length > 0
                      && Array.from({ length: 4 }).map(eachItem => (
                        <Skeleton className="rounded-xl">
                          <div className="h-20 rounded-xl bg-default-100" />
                        </Skeleton>
                      ))
                    }

                    {
                      !isSearching && searchTerm.length > 0 && results.length > 0
                      && results.map(eachItem => (
                        <BrandListCard
                          key={eachItem.name}
                          isLoading={isSearching}
                          name={eachItem.name}
                          rawName={eachItem.rawName}
                          feedbackCount={eachItem.feedbackCount}
                          description={eachItem.description}
                          avatarUrl={eachItem.brandImage}
                        />
                      ))
                    }

                    {
                      !isSearching && searchTerm.length > 0 && results.length === 0
                      && <EmptyCard>
                        <div className={"text-lg text-content4"}>
                          No brand match your search
                        </div>
                      </EmptyCard>
                    }

                    {
                      searchTerm.length === 0
                      && <div className={"flex flex-col justify-center items-center h-96 w-full text-foreground-400"}>
                        What do you want to search for?
                      </div>
                    }
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
