"use client";

import EmptyCard from "@/components/EmptyCard";
import EventInviteCard from "@/components/EventInviteCard";
import FeedbackCard from "@/components/FeedbackCard";
import ProductCard from "@/components/ProductCard";
import { TrendingBrandCard } from "@/components/TrendingCard";
import { useFeedbacksContext } from "@/context";
import { IBrands, IEvents, IUser } from "@/types";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { LucideBadgeMinus, LucideCheck, LucideInfo, LucideUserPlus2 } from "lucide-react";
import React, { useEffect } from "react";
import { DBTables, E_ProfileAction } from "@/types/enums";
import { supabase } from "@/utils/supabase/supabase";
import { CreateProfileModal } from "@/components/profileModal";
import { useDisclosure } from "@nextui-org/modal";
import { DotSpacer } from "@/components/TextSkeleton";
import { Tooltip } from "@nextui-org/tooltip";
import CreateBrand from "@/app/app/brand/new/page";
import CreateBrandModal from "@/components/Modals/CreateBrandModal";

const accordionItemClasses = {
  base: "py-0 w-full",
  title: "font-normal text-medium",
  trigger:
    "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
  indicator: "text-medium",
  content: "text-small px-2"
};

const ProfileCard = ({ myBrands, followedBrands, isFollowed }: { myBrands: IBrands[], followedBrands: IBrands[], isFollowed: boolean }) => {
  const [userData, setUserData] = React.useState<IUser>();
  const {
    user,
    userDB
  } = useFeedbacksContext();

  return (
    <Card className="min-w-[340px] max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={userDB?.dp || user?.user_metadata.avatar_url}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            {!user?.email ? (
              <Skeleton
                isLoaded={!!user?.email}
                className="w-5/6 h-6 rounded-full"
              ></Skeleton>
            ) : (
              <h4 className="text-small font-semibold leading-none text-default-600">
                {user?.user_metadata.full_name}
              </h4>
            )}
            <Skeleton
              isLoaded={!!user?.email}
              className="rounded-full"
            >
              <h5 className="text-small tracking-tight text-default-400">
                @{user?.email}
              </h5>
            </Skeleton>
          </div>
        </div>
        {/*
        // You cannot follow a user, so follow is not needed here.
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
          // onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>*/}
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{userDB?.bio}</p>
        {/*<span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>*/}
      </CardBody>
      <CardFooter className="gap-1">
        <div className="flex gap-1 hover:underline hover:underline-offset-4 hover:decoration-content2-foreground">
          <Skeleton
            isLoaded={!!myBrands}
            className="rounded-full"
          >
            <Tooltip content="The brands you've created" showArrow={true} placement={"bottom"}>
              <p className="font-semibold text-default-400 text-small">
                {myBrands?.length ? Number(myBrands?.length) : 0}
              </p>
            </Tooltip>
          </Skeleton>
          <Tooltip content="The brands you've created" placement={"bottom"}>
            <p className="text-default-400 text-small">
              {Number(myBrands?.length) > 1 ? "Brands" : "Brand"}
            </p>
          </Tooltip>
        </div>
        <DotSpacer />
        <div className="flex gap-1">
          <Skeleton
            isLoaded={!!followedBrands}
            className="rounded-full"
          >
            <p className="font-semibold text-default-400 text-small">
              {followedBrands?.length > 0
                ? Number(followedBrands?.length > 0)
                : 0}
            </p>
          </Skeleton>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        {/* <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div> */}
      </CardFooter>
    </Card>
  );
};

export default function Page() {
  const { onOpen } = useDisclosure();
  const {
    // isMyBrandsDataFetching,
    myEventInvites,
    multipleEventsInvitesData,
    myFeedbacksData,
    isMyFeedbacksDataFetching,
    myEventsData,
    mySentFeedbacksData,
    user,
    userDB
  } = useFeedbacksContext();
  const [isFollowed, setIsFollowed] = React.useState(false);
  const [myBrandsData, setMyBrandsData] = React.useState<IBrands[]>([]);
  const [followedBrandsData, setFollowedBrandsData] = React.useState<IBrands[]>([]);
  // const [sentFeedbacks, setSentFeedbacks] = React.useState<IFeedbacks[]>([]);
  const [isMyBrandsDataFetching, setIsMyBrandsDataFetching] = React.useState<boolean>(false);

  useEffect(() => {
    async function getMyBrands() {
      setIsMyBrandsDataFetching(true);

      try {
        const { data, error } = await supabase
          .from(DBTables.Brand)
          .select("*")
          .eq("ownerEmail", user?.email)
          .range(0,10);

        if (error) {
          console.error("Error fetching your brands", error);
        }

        if (data && data.length > 0) {
          setMyBrandsData(data);
          setIsMyBrandsDataFetching(false);
        }
      } catch (e) {
        console.error("Error fetching your brands");
      } finally {
        setIsMyBrandsDataFetching(false);
      }
    }

    getMyBrands();

    async function getFollowedBrands() {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .contains("followers", [user?.email!])
        .range(0, 10);

      if (error) {
        console.error("Error fetching followed brands", error);
      }

      if (data && data.length > 0) {
        setFollowedBrandsData(data);
        setIsFollowed(data.filter((eachBrand: IBrands) => eachBrand.followers.includes(user?.email!)).length > 0);
      }
    }

    getFollowedBrands();

    /*async function getSentFeedbacks() {
      const {data, error} = await supabase
        .from(DBTables.Feedback)
        .select("*")
        .eq('email', user?.email!);

      if (error) {
        console.error("Error occurred when fetching userFeedbacks", error)
      }

      if (data && data.length > 0) {
        setSentFeedbacks(data);
      }
    }
    getSentFeedbacks()*/
  }, [user]);

  return (
    <section className="flex flex-row flex-nowrap">
      <section className="sticky top-20 lg:top-4 h-full space-y-2">
        <ProfileCard myBrands={myBrandsData} followedBrands={followedBrandsData} isFollowed={isFollowed} />

        <Accordion
          showDivider={false}
          className="p-2 flex flex-col gap-1 w-full"
          variant="shadow"
          itemClasses={accordionItemClasses}
        >
          <AccordionItem
            key="1"
            aria-label="Pending tasks"
            classNames={{ subtitle: userDB?.bio ? "text-success" : "text-warning" }}
            startContent={userDB?.bio ? <LucideCheck strokeWidth={3} className="text-success" /> :
              <LucideInfo strokeWidth={3} className="text-warning" />}
            subtitle={userDB?.bio ? "Profile completed" : "Complete your profile"}
            // title="Pending tasks"
          >
            {/* TODO: Make this the update profile modal. */}
            {/*<Button fullWidth onPress={() => {onOpen();}}>Update your profile</Button>*/}
            <CreateProfileModal buttonProps={{
              color: "default",
              fullWidth: true,
              startContent: <LucideUserPlus2 size={16} strokeWidth={2} />
            }} action={E_ProfileAction.update} buttonText="Update your Profile" />
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
                {mySentFeedbacksData?.length}{" "}
                {mySentFeedbacksData?.length !== 1 ? "feedbacks" : "feedback"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <span>Joined at:</span>
              <span>
                {user?.created_at}
              </span>
            </div>
          </CardBody>
        </Card>
      </section>
      <section className="space-y-12 py-4 px-8 lg:overflow-y-hidden w-full">
        {

          <section>
            {
              <header className="font-bold text-4xl leading-normal">
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
                        avatarUrl={eachBrand.brandImage}
                        description={eachBrand.description}
                      />
                    ))
                  ) : (
                    <EmptyCard>
                      <LucideBadgeMinus
                        size={40}
                        strokeWidth={1}
                        width={"100%"}
                      />
                      <div className={"text-2xl text-balance"}>
                        You haven't listed any brand yet
                      </div>

                      <CreateBrandModal />
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
                        <div
                          className="font-normal text-5xl leading-normal text-ellipsis whitespace-nowrap overflow-hidden">
                          &nbsp;
                        </div>
                      </Skeleton>
                    </CardBody>
                    <Skeleton
                      className="absolute left-8 bottom-8 w-2/6 h-4 font-extrabold text-sm rounded-full"></Skeleton>
                  </Card>
                ))
              )}
            </div>
          </section>}

        <section>
          <header className="font-bold text-4xl leading-normal">
            Brands you follow
          </header>
          <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
            {(followedBrandsData as IBrands[])?.length > 0 ? (
              (followedBrandsData as IBrands[])?.map((eachBrand) => (
                <TrendingBrandCard
                  key={eachBrand.id}
                  name={eachBrand.name}
                  rawName={eachBrand.rawName}
                  feedbackCount={eachBrand.feedbackCount}
                  avatarUrl={eachBrand.brandImage}
                  description={eachBrand.description}
                />
              ))
            ) : (
              <EmptyCard>
                <LucideBadgeMinus size={40} strokeWidth={1} width={"100%"} />
                You haven't listed any brand yet
              </EmptyCard>
            )}
          </div>
        </section>

        <section>
          <header className="font-mono font-bold text-4xl leading-normal">
            Your Feedbacks
          </header>
          <div className="flex flex-col gap-4 px-2 py-4">
            {!!mySentFeedbacksData && (
              <>
                {mySentFeedbacksData?.length > 0 ? (
                  mySentFeedbacksData?.map((eachFeedback) => (
                    <FeedbackCard
                      key={eachFeedback.id}
                      isLoaded={!isMyBrandsDataFetching}
                      {...eachFeedback}
                    />
                  ))
                ) : (
                  <EmptyCard>
                    <LucideBadgeMinus
                      size={80}
                      strokeWidth={1}
                      width={"100%"}
                    />
                    You haven't sent any feedback yet
                  </EmptyCard>
                )}
              </>
            )/* : (
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
            )*/}
          </div>
        </section>

        <section className="">
          <header className="font-bold text-4xl leading-normal">
            Your Event Feedback Invitation
          </header>
          <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
            {myEventInvites?.length > 0 &&
              (multipleEventsInvitesData as IEvents[])?.map(
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
