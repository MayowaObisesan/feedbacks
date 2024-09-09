"use client";

import { ListboxWrapper } from "./ListboxWrapper";
import { AddNoteIcon } from "./AddNoteIcon";
import { CopyDocumentIcon } from "./CopyDocumentation";
import { EditDocumentIcon } from "./EditDocumentation";
import { DeleteDocumentIcon } from "./DeleteDocumentation";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { cn } from "@nextui-org/theme";

const iconClasses =
  "text-xl text-default-500 pointer-events-none flex-shrink-0";

const categoryList = [
  {
    name: "Technology",
    description: "Feedback on technology",
    startContent: <AddNoteIcon className={iconClasses} />,
  },
  {
    name: "Games",
    description: "Feedback on games",
    startContent: <CopyDocumentIcon className={iconClasses} />,
  },
  {
    name: "Science",
    description: "Feedback on science stuffs",
    startContent: <EditDocumentIcon className={iconClasses} />,
  },
  {
    name: "Art",
    description: "Feedback on arts, craft and amazing art",
    startContent: <EditDocumentIcon className={iconClasses} />,
  },
  {
    name: "Web3",
    description: "Feedback on web3 and blockchain stuffs",
    startContent: <EditDocumentIcon className={iconClasses} />,
  },
];

export default function HomeNav() {
  return (
    <ListboxWrapper>
      <Listbox
        variant="flat"
        aria-label="Listbox menu with sections"
        className="flex flex-row flex-nowrap"
        emptyContent="No Categories"
      >
        <ListboxSection
          title="Categories"
          showDivider
          className="grow shrink-0 space-y-4 px-4"
          items={categoryList}
          itemClasses={{
            base: "",
            wrapper: "",
          }}
          classNames={{
            base: "",
            group: "space-y-4",
            heading: "text-base py-4",
          }}
        >
          {(eachCategory) => (
            <ListboxItem
              key={eachCategory.name.toLowerCase()}
              description={eachCategory.description}
              startContent={eachCategory.startContent}
              className=""
            >
              {eachCategory.name}
            </ListboxItem>
          )}
        </ListboxSection>
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
      </Listbox>
    </ListboxWrapper>
  );
}
