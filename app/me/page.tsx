"use client";

import EmptyCard from "@/components/EmptyCard";
import EventInviteCard from "@/components/EventInviteCard";
import FeedbackCard from "@/components/FeedbackCard";
import ProductCard from "@/components/ProductCard";
import { TrendingBrandCard, TrendingCard } from "@/components/TrendingCard";
import { useFeedbacksContext } from "@/context";
import useRead, { useBrandRead } from "@/hooks/useRead";
import { IBrands, IEvents, IFeedbacks } from "@/types";
import { formatDate, parseImageHash, shortenAddress } from "@/utils";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { LucideBadgeMinus, LucideInfo } from "lucide-react";
import React from "react";
import { useAccount } from "wagmi";

const accordionItemClasses = {
  base: "py-0 w-full",
  title: "font-normal text-medium",
  trigger:
    "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
  indicator: "text-medium",
  content: "text-small px-2",
};

const ProfileCard = () => {
  const [isFollowed, setIsFollowed] = React.useState(false);
  const { address, isConnected } = useAccount();
  const {
    myProfileData,
    isMyProfileDataFetching,
    myBrandCount,
    myBrandsData,
    isMyBrandCountFetching,
    isMyBrandCountSuccessful,
    myFollowedBrandsData,
    isMyFollowedBrandsDataStale,
  } = useFeedbacksContext();

  return (
    <Card className="min-w-[340px] max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={
              parseImageHash(myProfileData?.profilePictureHash) ||
              "https://nextui.org/avatars/avatar-1.png"
            }
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            {isMyProfileDataFetching ? (
              <Skeleton
                isLoaded={!isMyProfileDataFetching}
                className="w-5/6 h-6 rounded-full"
              ></Skeleton>
            ) : (
              <h4 className="text-small font-semibold leading-none text-default-600">
                {myProfileData?.name}
              </h4>
            )}
            <Skeleton
              isLoaded={!isMyProfileDataFetching}
              className="rounded-full"
            >
              <h5 className="text-small tracking-tight text-default-400">
                @{shortenAddress(address as string)}
              </h5>
            </Skeleton>
          </div>
        </div>
        <Button
          className={
            isFollowed
              ? "bg-transparent text-foreground border-default-200"
              : ""
          }
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{myProfileData?.bio}</p>
        <span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <Skeleton
            isLoaded={isMyBrandCountSuccessful}
            className="rounded-full"
          >
            <p className="font-semibold text-default-400 text-small">
              {myBrandsData?.length ? Number(myBrandsData?.length) : 0}
            </p>
          </Skeleton>
          <p className=" text-default-400 text-small">
            {Number(myBrandsData?.length) > 1 ? "Brands" : "Brand"}
          </p>
        </div>
        <div className="flex gap-1">
          <Skeleton
            isLoaded={isMyBrandCountSuccessful}
            className="rounded-full"
          >
            <p className="font-semibold text-default-400 text-small">
              {myFollowedBrandsData?.length > 0
                ? Number(myFollowedBrandsData?.length > 0)
                : 0}
            </p>
          </Skeleton>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function Page() {
  const {
    myAddress,
    myProfileData,
    myBrandsData,
    isMyBrandsDataFetching,
    multipleEventsInvitesData,
    isMultipleInvitesDataFetching,
    myFeedbacksData,
    isMyFeedbacksDataFetching,
    myEventsData,
    isMyEventsDataFetching,
    myFollowedBrandsData,
    isMyFollowedBrandsDataFetching,
  } = useFeedbacksContext();
  // const { data: myBrandsData, isFetching: isMyBrandsFetching } = useBrandRead({
  //   functionName: "getMyBrands",
  //   // args: [myAddress],
  //   account: myAddress,
  // });
  console.log("Brand myBrandsData", myBrandsData);

  return (
    <section className="flex flex-row flex-nowrap">
      <section className="sticky top-20 h-full space-y-2">
        <ProfileCard />

        <Accordion
          showDivider={false}
          className="p-2 flex flex-col gap-1 w-full"
          variant="shadow"
          itemClasses={accordionItemClasses}
        >
          <AccordionItem
            key="1"
            aria-label="Pending tasks"
            classNames={{ subtitle: "text-warning" }}
            startContent={<LucideInfo className="text-warning" />}
            subtitle="Complete your profile"
            // title="Pending tasks"
          >
            {/* TODO: Make this the update profile modal. */}
            <Button fullWidth>Update your profile</Button>
          </AccordionItem>
        </Accordion>

        <Card>
          <CardHeader>Other details</CardHeader>
          <CardBody className="text-default-500 text-sm space-y-2">
            <div className="flex flex-row items-center gap-x-2">
              <span>Events:</span>
              <span>
                {myEventsData?.length}{" "}
                {myEventsData?.length !== 1 ? "events" : "event"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <span>Feedback:</span>
              <span>
                {myFeedbacksData?.length}{" "}
                {myFeedbacksData?.length !== 1 ? "feedbacks" : "feedback"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <span>Joined at:</span>
              <span>
                {myProfileData?.creationTime &&
                  formatDate(Number(myProfileData?.creationTime))}{" "}
              </span>
            </div>
          </CardBody>
        </Card>
      </section>
      <section className="space-y-8 py-4 px-8 lg:overflow-y-hidden">
        <section>
          {
            <header className="font-bold text-5xl leading-normal">
              Your Brands
            </header>
          }
          <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
            {!isMyBrandsDataFetching ? (
              <>
                {(myBrandsData as IBrands[])?.length > 0 ? (
                  (myBrandsData as IBrands[])?.map((eachBrand) => (
                    <TrendingBrandCard
                      key={eachBrand.name}
                      name={eachBrand.name}
                      feedbackCount={Number(eachBrand.feedbackCount)}
                      rawName={eachBrand.rawName}
                    />
                  ))
                ) : (
                  <EmptyCard>
                    <LucideBadgeMinus
                      size={80}
                      strokeWidth={1}
                      width={"100%"}
                    />
                    You haven't listed any brand yet
                    {myBrandsData?.length}
                  </EmptyCard>
                )}
              </>
            ) : (
              [1, 2, 3, 4].map(() => (
                <Card
                  className="min-w-[280px] lg:min-w-[360px] h-[200px]"
                  as={"button"}
                >
                  <CardBody className="flex flex-col justify-center px-8">
                    <Skeleton
                      isLoaded={false}
                      className={"w-5/6 h-12 mt-4 rounded-full"}
                    >
                      <div className="font-normal text-5xl leading-normal text-ellipsis whitespace-nowrap overflow-hidden">
                        &nbsp;
                      </div>
                    </Skeleton>
                  </CardBody>
                  <Skeleton className="absolute left-8 bottom-8 w-2/6 h-4 font-extrabold text-sm rounded-full"></Skeleton>
                </Card>
              ))
            )}
          </div>
        </section>

        <section>
          <header className="font-bold text-4xl leading-normal">
            Brands you follow
          </header>
          <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
            {(myFollowedBrandsData as IBrands[])?.length > 0 ? (
              (myFollowedBrandsData as IBrands[])?.map((eachBrand) => (
                <TrendingCard />
              ))
            ) : (
              <EmptyCard>
                <LucideBadgeMinus size={80} strokeWidth={1} width={"100%"} />
                You haven't listed any brand yet
              </EmptyCard>
            )}
          </div>
        </section>

        <section>
          <header className="font-mono font-bold text-4xl leading-normal">
            Your Feedback
          </header>
          <div className="flex flex-col gap-4 px-2 py-4">
            {!isMyBrandsDataFetching ? (
              <>
                {(myFeedbacksData as IFeedbacks[])?.length > 0 ? (
                  (myFeedbacksData as IFeedbacks[])?.map((eachBrand) => (
                    <FeedbackCard />
                  ))
                ) : (
                  <EmptyCard>
                    <LucideBadgeMinus
                      size={80}
                      strokeWidth={1}
                      width={"100%"}
                    />
                    You haven't listed any brand yet
                  </EmptyCard>
                )}
              </>
            ) : (
              [1, 2, 3, 4].map(() => (
                <Skeleton isLoaded={isMyFeedbacksDataFetching}>
                  <FeedbackCard />
                </Skeleton>
                // <Card
                //   className="min-w-[280px] lg:min-w-[360px] h-[200px]"
                //   as={"button"}
                // >
                //   <CardBody className="flex flex-col justify-center px-8">
                //     <Skeleton
                //       isLoaded={!isMyFeedbacksDataFetching}
                //       className={"w-5/6 h-12 mt-4 rounded-full"}
                //     >
                //       <div className="font-normal text-5xl leading-normal text-ellipsis whitespace-nowrap overflow-hidden">
                //         &nbsp;
                //       </div>
                //     </Skeleton>
                //   </CardBody>
                //   <Skeleton className="absolute left-8 bottom-8 w-2/6 h-4 font-extrabold text-sm rounded-full"></Skeleton>
                // </Card>
              ))
            )}
          </div>
        </section>

        <section className="">
          <header className="font-bold text-4xl leading-normal">
            Your Event Feedback Invitation
          </header>
          <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
            {(multipleEventsInvitesData as IEvents[])?.map(
              (eachEventInvite) => (
                <EventInviteCard key={eachEventInvite} {...eachEventInvite} />
              )
            )}
          </div>
        </section>

        <section className="">
          <header className="font-bold text-4xl leading-normal">
            Your Products
          </header>
          <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
            {(multipleEventsInvitesData as IEvents[])?.map(
              (eachEventInvite) => (
                <ProductCard />
              )
            )}
          </div>
        </section>
      </section>
    </section>
  );
}
