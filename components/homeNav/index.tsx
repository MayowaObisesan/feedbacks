"use client";

import { ListboxWrapper } from "./ListboxWrapper";
import { AddNoteIcon } from "./AddNoteIcon";
import { CopyDocumentIcon } from "./CopyDocumentation";
import { EditDocumentIcon } from "./EditDocumentation";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { useWindowSize } from "usehooks-ts";
import { E_DeviceWidth } from "@/types/enums";
import { Chip } from "@nextui-org/chip";
import { categoryListObject } from "@/constant";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import CustomSuspense from "@/components/CustomSuspense";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";

const iconClasses =
  "text-xl text-default-500 pointer-events-none flex-shrink-0";

const categoryList = [
  {
    name: "Technology",
    // description: "Feedback on technology",
    startContent: <AddNoteIcon className={iconClasses} />
  },
  {
    name: "Games",
    // description: "Feedback on games",
    startContent: <CopyDocumentIcon className={iconClasses} />
  },
  {
    name: "Science",
    // description: "Feedback on science stuffs",
    startContent: <EditDocumentIcon className={iconClasses} />
  },
  {
    name: "Art",
    // description: "Feedback on arts, craft and amazing art",
    startContent: <EditDocumentIcon className={iconClasses} />
  },
  {
    name: "Web3",
    // description: "Feedback on web3 and blockchain stuffs",
    startContent: <EditDocumentIcon className={iconClasses} />
  },
  {
    name: "Entertainment",
    // description: "Feedback on web3 and blockchain stuffs",
    startContent: <EditDocumentIcon className={iconClasses} />
  }
];

export default function HomeNav() {
  const size = useWindowSize();

  const LoadingEffect = () => {
    return (
      <div className="w-full flex flex-col gap-2">
        {
          Array.from({length: 12}).map(() => (
            <Skeleton className="h-12 w-3/5 rounded-lg" />
          ))
        }
      </div>
    )
  }

  return (
    <CustomSuspense delay={1000} fallback={<LoadingEffect />}>
      {
        size.width >= E_DeviceWidth.laptop
          ? <ListboxWrapper>
            <Listbox
            variant="flat"
            aria-label="Listbox menu with sections"
            className="flex flex-row flex-nowrap"
            emptyContent="No Categories"
          >
            <ListboxSection
              title="Categories"
              showDivider={false}
              className="grow shrink-0 space-y-4 px-4"
              items={categoryListObject()}
              itemClasses={{
                base: "",
                wrapper: ""
              }}
              classNames={{
                base: "",
                group: "space-y-4",
                heading: "text-base py-4"
              }}
            >
              {(eachCategory) => (
                <ListboxItem
                  key={eachCategory.name.toLowerCase()}
                  // description={eachCategory?.description}
                  startContent={eachCategory.startContent}
                  className=""
                >
                  {eachCategory.name}
                </ListboxItem>
              )}
            </ListboxSection>
            {/*
              <ListboxSection title="Danger zone" className="grow-0 shrink">
                <ListboxItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  description="Permanently delete the file"
                  startContent={
                    <DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />
                  }
                >
                  Delete file
                </ListboxItem>
              </ListboxSection>
            */}
          </Listbox>
        </ListboxWrapper>
        : (
          <div className={"flex flex-col gap-y-2 w-full"}>
            <div className={"px-2 font-bold text-lg"}>Categories</div>
            <ScrollShadow orientation={"horizontal"}>
              <div className="flex flex-row gap-2 pb-2 overflow-x-scroll">
                {categoryListObject().map((eachCategory) => (
                  <Chip size={"lg"} radius={"sm"} className={"first-of-type:ml-2 last-of-type:mr-2"}>{eachCategory.name}</Chip>
                ))}
              </div>
            </ScrollShadow>
          </div>
        )
    }
    </CustomSuspense>
  );
}
