"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { cn } from "@nextui-org/theme";
import { ListboxWrapper } from "../homeNav/ListboxWrapper";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import useRead from "@/hooks/useRead";
import { CreateEventModal } from "../CreateEventModal";
import { useFeedbacksContext } from "@/context";
import { useCallback, useEffect } from "react";
import useMyEvents from "@/hooks/useMyEvents";
import { CreateProductModal } from "../Modals/CreateProductModal";
import { IBrands } from "@/types";
import { CreateFeedbackModal } from "../Modals/CreateFeedbackModal";

const iconClasses =
  "text-xl text-default-500 pointer-events-none flex-shrink-0";

const categoryList = [
  {
    name: "Technology",
    description: "Feedback on technology",
  },
  {
    name: "Games",
    description: "Feedback on games",
  },
  {
    name: "Science",
    description: "Feedback on science stuffs",
  },
  {
    name: "Art",
    description: "Feedback on arts, craft and amazing art",
  },
  {
    name: "Web3",
    description: "Feedback on web3 and blockchain stuffs",
  },
];

export default function BrandNav({ brandName }: { brandName: string }) {
  const {
    myAddress,
    myEventInvites,
    isMyEventInvitesFetching,
    isMyEventInvitesSuccessful,
  } = useFeedbacksContext();
  console.log(myEventInvites, typeof myEventInvites);
  const { data } = useRead({
    functionName: "getAllBrands",
    args: [brandName, "0x0000000000000000000000000000000000000000"],
  });

  const actionsList = [
    {
      text: "Add Event",
      description: "Add event modal",
      modal: (
        <CreateEventModal
          brandId={data ? (data as IBrands[])[0]?.brandId : null}
        />
      ),
    },
    {
      text: "Add Product",
      description: "Add product modal",
      modal: (
        <CreateProductModal
          brandId={data ? (data as IBrands[])[0]?.brandId : null}
        />
      ),
    },
    {
      text: "Add Feedback",
      description: "Add Feedback modal",
      modal: (
        <CreateFeedbackModal
          brandId={data ? (data as IBrands[])[0]?.brandId : null}
        />
      ),
    },
  ];

  useEffect(() => {
    if (!isMyEventInvitesFetching) {
    }
  }, [isMyEventInvitesSuccessful]);

  return (
    <ListboxWrapper>
      <Listbox
        variant="flat"
        aria-label="Listbox menu with sections"
        className="flex flex-row flex-nowrap"
        emptyContent="No Categories"
      >
        <ListboxItem key={"brandProfile"} textValue="brandProfile">
          <Card className="py-4 bg-transparent shadow-none">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Brand Details</p>
              <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">{data && data[0]?.name}</h4>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src="https://nextui.org/images/hero-card-complete.jpeg"
                width={270}
              />
            </CardBody>
          </Card>
          <div>Feedback Listing Invite</div>
          <div>Invites for Feedback Events</div>
          <div>
            {myEventInvites?.length}{" "}
            {myEventInvites?.length > 1 ? "Pending Invites" : "Pending Invite"}
          </div>
        </ListboxItem>
        <ListboxSection
          title="Actions"
          showDivider
          className="grow shrink-0 space-y-4 px-4"
          items={actionsList}
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
          {(eachAction) => (
            <ListboxItem
              key={eachAction.text.toLocaleLowerCase()}
              description={eachAction.description}
              textValue={eachAction.text}
            >
              {eachAction.modal}
            </ListboxItem>
          )}
        </ListboxSection>
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
          >
            Delete file
          </ListboxItem>
        </ListboxSection>
      </Listbox>
    </ListboxWrapper>
  );
}
