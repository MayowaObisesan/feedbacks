"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { cn } from "@nextui-org/theme";
import { ListboxWrapper } from "../homeNav/ListboxWrapper";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import useRead, { useBrandRead } from "@/hooks/useRead";
import { CreateEventModal } from "../CreateEventModal";
import { useFeedbacksContext } from "@/context";
import { useCallback, useEffect } from "react";
import useMyEvents from "@/hooks/useMyEvents";
import { CreateProductModal } from "../Modals/CreateProductModal";
import { IBrands } from "@/types";
import { CreateFeedbackModal } from "../Modals/CreateFeedbackModal";
import { parseImageHash } from "@/utils";
import UpdateBrandModal from "../Modals/UpdateBrandModal";
import { Address } from "viem";
import { Skeleton } from "@nextui-org/skeleton";

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
  const { data: _thisBrandData } = useBrandRead({
    functionName: "getAllBrands",
    args: [brandName, "0x0000000000000000000000000000000000000000", ""],
  });

  const thisBrandData = _thisBrandData
    ? (_thisBrandData as IBrands[])[0]
    : null;

  const {
    data: thisBrandFollowersData,
    isSuccess: isBrandFollowersDataSuccessful,
  } = useBrandRead({
    functionName: "getFollowers",
    args: [thisBrandData?.brandId],
  });
  console.log(thisBrandData);

  const actionsList = [
    {
      text: "Update Brand",
      description: "",
      modal: (
        <UpdateBrandModal
          brandId={thisBrandData ? thisBrandData?.brandId : null}
        />
      ),
    },
    {
      text: "Add Event",
      description: "Add event modal",
      modal: (
        <CreateEventModal
          brandId={thisBrandData ? thisBrandData?.brandId : null}
        />
      ),
    },
    {
      text: "Add Product",
      description: "Add product modal",
      modal: (
        <CreateProductModal
          brandId={thisBrandData ? thisBrandData?.brandId : null}
        />
      ),
    },
    {
      text: "Add Feedback",
      description: "Add Feedback modal",
      modal: (
        <CreateFeedbackModal
          brandId={thisBrandData ? thisBrandData?.brandId : null}
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
              <h4 className="font-bold text-large">
                {(_thisBrandData as IBrands[])?.length > 0 &&
                  thisBrandData?.name}
              </h4>
              {/* {thisBrandData?.owner} */}
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={
                  ((_thisBrandData as IBrands[])?.length > 0 &&
                    parseImageHash(thisBrandData?.imageHash!)) ||
                  "https://nextui.org/images/hero-card-complete.jpeg"
                }
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
          <div className="flex gap-1">
            <Skeleton
              isLoaded={isBrandFollowersDataSuccessful}
              className="rounded-full"
            >
              <p className="font-semibold text-default-400 text-small">
                {(thisBrandFollowersData as Address[])?.length
                  ? (thisBrandFollowersData as Address[])?.length
                  : 0}
              </p>
            </Skeleton>
            <p className=" text-default-400 text-small">
              {(thisBrandFollowersData as Address[])?.length > 1
                ? "Followers"
                : "Follower"}
            </p>
            {/* <p className="font-semibold text-default-400 text-small">
              {(thisBrandFollowersData as Address[])?.length}
            </p>
            <p className="text-default-400 text-small">Followers</p> */}
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
