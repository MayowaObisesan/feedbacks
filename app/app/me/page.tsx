"use client";

import type { Tables } from "@/types/supabase";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import {
  LucideCheck,
  LucideFocus,
  LucideInfo,
  LucideLayoutTemplate,
  LucideMessagesSquare,
  LucideUserPlus2,
} from "lucide-react";
import React from "react";
import { Tooltip } from "@heroui/tooltip";
import { User } from "@supabase/auth-js";

import EmptyCard from "@/components/EmptyCard";
import FeedbackCard from "@/components/FeedbackCard";
import { TrendingBrandCard } from "@/components/TrendingCard";
import { useFeedbacksContext } from "@/context";
import { IBrands, IUser } from "@/types";
import { DBTables, E_ProfileAction } from "@/types/enums";
import { CreateProfileModal } from "@/components/profileModal";
import { DotSpacer } from "@/components/TextSkeleton";
import CreateBrandModal from "@/components/Modals/CreateBrandModal";
import { useFollowedBrands, useMyBrands } from "@/hooks/useBrands";
import TrendingBrandCardSkeleton from "@/components/Skeletons/TrendingBrandCardSkeleton";
import { formatDateString } from "@/utils";

type Brand = Tables<DBTables.Brand>;

const accordionItemClasses = {
  base: "py-0 w-full",
  title: "font-normal text-medium",
  trigger:
    "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
  indicator: "text-medium",
  content: "text-small px-2",
};

const ProfileCard = ({
  myBrands,
  followedBrands,
  user,
  userDB,
}: {
  myBrands: Brand[];
  followedBrands: Brand[];
  user: User;
  userDB: IUser;
  isFollowed: boolean;
}) => {
  // const [userData, setUserData] = React.useState<IUser>();
  // const { user, userDB } = useFeedbacksContext();

  return (
    <Card className="lg:min-w-[340px] lg:max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="lg"
            src={userDB?.dp || user?.user_metadata.avatar_url}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            {!user?.email ? (
              <Skeleton
                className="w-5/6 h-6 rounded-full"
                isLoaded={!!user?.email}
              />
            ) : (
              <h4 className="text-small font-semibold leading-none">
                {user?.user_metadata.full_name}
              </h4>
            )}
            <Skeleton className="rounded-full" isLoaded={!!user?.email}>
              <h5 className="text-small tracking-tight text-default-500">
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
      <CardBody className="px-3 py-0 text-small text-default-500">
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
          <Skeleton className="rounded-full" isLoaded={!!myBrands}>
            <Tooltip
              content="The brands you've created"
              placement={"bottom"}
              showArrow={true}
            >
              <p className="font-semibold text-default-600 text-small">
                {myBrands?.length ? Number(myBrands?.length) : 0}
              </p>
            </Tooltip>
          </Skeleton>
          <Tooltip content="The brands you've created" placement={"bottom"}>
            <p className="text-default-600 text-small">
              {Number(myBrands?.length) > 1 ? "Brands" : "Brand"}
            </p>
          </Tooltip>
        </div>
        <DotSpacer />
        <div className="flex gap-1">
          <Skeleton className="rounded-full" isLoaded={!!followedBrands}>
            <p className="font-semibold text-default-600 text-small">
              {followedBrands?.length > 0
                ? Number(followedBrands?.length > 0)
                : 0}
            </p>
          </Skeleton>
          <p className=" text-default-600 text-small">Following</p>
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
  // const { onOpen } = useDisclosure();
  const { mySentFeedbacksData, user, userDB } = useFeedbacksContext();
  const { data: myBrands, isLoading: myBrandsLoading } = useMyBrands(
    user?.email!,
  );
  const { data: followedBrands } = useFollowedBrands(user?.email!);
  // const [isFollowed, setIsFollowed] = React.useState(false);
  // const [myBrandsData, setMyBrandsData] = React.useState<IBrands[]>([]);
  // const [followedBrandsData, setFollowedBrandsData] = React.useState<IBrands[]>(
  //   [],
  // );
  // const [sentFeedbacks, setSentFeedbacks] = React.useState<IFeedbacks[]>([]);
  // const [isMyBrandsDataFetching, setIsMyBrandsDataFetching] =
  //   React.useState<boolean>(false);

  /*useEffect(() => {
    async function getMyBrands() {
      setIsMyBrandsDataFetching(true);

      try {
        const { data, error } = await supabase
          .from(DBTables.Brand)
          .select("*")
          .eq("ownerEmail", user?.email)
          .range(0, 10);

        if (error) {
          // console.error("Error fetching your brands", error);
        }

        if (data && data.length > 0) {
          setMyBrandsData(data);
          setIsMyBrandsDataFetching(false);
        }
      } catch (e) {
        // console.error("Error fetching your brands");
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
        // console.error("Error fetching followed brands", error);
      }

      if (data && data.length > 0) {
        setFollowedBrandsData(data);
        setIsFollowed(
          data.filter((eachBrand: IBrands) =>
            eachBrand.followers.includes(user?.email!),
          ).length > 0,
        );
      }
    }

    getFollowedBrands();

    async function getSentFeedbacks() {
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
    getSentFeedbacks()
  }, [user]);*/

  return (
    <section className="flex flex-col lg:flex-row flex-nowrap gap-4">
      <section className="relative lg:sticky lg:top-4 h-full space-y-2 px-2 py-5">
        <ProfileCard
          followedBrands={followedBrands!}
          isFollowed={false}
          myBrands={myBrands!}
          user={user!}
          userDB={userDB!}
        />

        <Accordion
          className="p-2 flex flex-col gap-1 w-full"
          itemClasses={accordionItemClasses}
          showDivider={false}
          variant="shadow"
        >
          <AccordionItem
            key="1"
            aria-label="Pending tasks"
            classNames={{
              subtitle: userDB?.bio ? "text-success" : "text-warning",
            }}
            startContent={
              userDB?.bio ? (
                <LucideCheck className="text-success" strokeWidth={3} />
              ) : (
                <LucideInfo className="text-warning" strokeWidth={3} />
              )
            }
            subtitle={
              userDB?.bio ? "Profile completed" : "Complete your profile"
            }
            // title="Pending tasks"
          >
            {/* TODO: Make this the update profile modal. */}
            {/*<Button fullWidth onPress={() => {onOpen();}}>Update your profile</Button>*/}
            <CreateProfileModal
              action={E_ProfileAction.update}
              buttonProps={{
                color: "default",
                fullWidth: true,
                startContent: <LucideUserPlus2 size={16} strokeWidth={2} />,
              }}
              buttonText="Update your Profile"
            />
          </AccordionItem>
        </Accordion>

        <Card>
          <CardHeader>Other details</CardHeader>
          <CardBody className="text-default-500 text-sm space-y-2">
            {/*<div className="flex flex-row items-center gap-x-2">
              <span>Events:</span>
              <span>
                {myEventsData?.length}{" "}
                {myEventsData?.length !== 1 ? "events" : "event"}
              </span>
            </div>*/}
            <div className="flex flex-row items-center gap-x-2">
              <span>Feedback:</span>
              <span>
                {mySentFeedbacksData?.length}{" "}
                {mySentFeedbacksData?.length !== 1 ? "feedbacks" : "feedback"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-x-2">
              <span>Joined at:</span>
              <span>{formatDateString(user?.created_at!)}</span>
            </div>
          </CardBody>
        </Card>
      </section>
      <section className="space-y-12 py-4 px-3 lg:px-8 lg:overflow-y-hidden w-full">
        {
          <section>
            {
              <header className="font-bold text-xl lg:text-3xl leading-normal">
                Your Brands
              </header>
            }
            <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
              {!myBrandsLoading ? (
                <>
                  {(myBrands as IBrands[])?.length > 0 ? (
                    (myBrands as IBrands[])?.map((eachBrand) => (
                      <TrendingBrandCard
                        key={eachBrand.name}
                        avatarUrl={eachBrand.brandImage}
                        description={eachBrand.description}
                        feedbackCount={Number(eachBrand.feedbackCount)}
                        name={eachBrand.name}
                        rawName={eachBrand.rawName}
                      />
                    ))
                  ) : (
                    <EmptyCard>
                      <div className={"flex flex-col items-center gap-y-5"}>
                        <LucideLayoutTemplate
                          size={32}
                          strokeWidth={1}
                          width={"100%"}
                        />
                        <div className={"text-lg lg:text-2xl text-balance"}>
                          You haven&apos;t listed any brand yet
                        </div>

                        <CreateBrandModal />
                      </div>
                    </EmptyCard>
                  )}
                </>
              ) : (
                [1, 2, 3, 4].map((_) => (
                  <TrendingBrandCardSkeleton key={_ as number} />
                ))
              )}
            </div>
          </section>
        }

        <section>
          <header className="font-bold text-xl lg:text-3xl leading-normal">
            Brands you follow
          </header>
          <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
            {(followedBrands as IBrands[])?.length > 0 ? (
              (followedBrands as IBrands[])?.map((eachBrand) => (
                <TrendingBrandCard
                  key={eachBrand.id}
                  avatarUrl={eachBrand.brandImage}
                  description={eachBrand.description}
                  feedbackCount={eachBrand.feedbackCount}
                  name={eachBrand.name}
                  rawName={eachBrand.rawName}
                />
              ))
            ) : (
              <EmptyCard>
                <div className={"flex flex-col items-center gap-y-5"}>
                  <LucideFocus size={40} strokeWidth={1} width={"100%"} />
                  <div className={"text-lg lg:text-2xl text-balance"}>
                    You don&apos;t follow any brand yet
                  </div>
                </div>
              </EmptyCard>
            )}
          </div>
        </section>

        <section>
          <header className="font-mono font-bold text-xl lg:text-3xl leading-normal">
            Your Feedbacks
          </header>
          <div className="flex flex-col gap-4 px-2 py-4">
            {
              !!mySentFeedbacksData && (
                <>
                  {mySentFeedbacksData?.length > 0 ? (
                    mySentFeedbacksData?.map((eachFeedback) => (
                      // @ts-ignore
                      <FeedbackCard
                        key={eachFeedback.id}
                        isLoaded={!myBrandsLoading}
                        {...eachFeedback}
                      />
                    ))
                  ) : (
                    <EmptyCard>
                      <div className={"flex flex-col items-center gap-y-5"}>
                        <LucideMessagesSquare
                          size={40}
                          strokeWidth={1}
                          width={"100%"}
                        />
                        <div className={"text-lg lg:text-2xl text-balance"}>
                          You haven&apos;t sent any feedback yet
                        </div>
                      </div>
                    </EmptyCard>
                  )}
                </>
              ) /* : (
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
            )*/
            }
          </div>
        </section>

        {/*<section className="">
          <header className="font-bold text-4xl leading-normal">
            Your Event Feedback Invitation
          </header>
          <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
            {myEventInvites?.length > 0 &&
              (multipleEventsInvitesData as IEvents[])?.map(
                (eachEventInvite) => (
                  <EventInviteCard key={eachEventInvite} {...eachEventInvite} />
                ),
              )}
          </div>
        </section>

        <section className="">
          <header className="font-bold text-4xl leading-normal">
            Your Products
          </header>
          <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
            {(multipleEventsInvitesData as IEvents[])?.map(
              (eachEventInvite) => <ProductCard />,
            )}
          </div>
        </section>*/}
      </section>
    </section>
  );
}
