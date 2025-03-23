"use client";

import type { Tables } from "@/types/supabase";

import { Avatar, AvatarIcon } from "@heroui/avatar";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import React, { useEffect } from "react";
import { useIsMounted } from "usehooks-ts";
import clsx from "clsx";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { cn } from "@heroui/theme";
import { Button, ButtonGroup } from "@heroui/button";
import { LucideThumbsDown, LucideThumbsUp } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { StarItem } from "../RatingStars/RatingComponent";

import { DBTables } from "@/types/enums";
import { supabase } from "@/utils/supabase/supabase";
import { formatDateString, hashFullName } from "@/utils";
import { useBrandById } from "@/hooks/useBrands";
import { useUpdateFeedbackLikes } from "@/hooks/useFeedbacks";
import { FeedbackReplies, IUser } from "@/types";
import { ReplyFeedbackModal } from "@/components/Modals/ReplyFeedbackModal";
import { useUserAndUserDBQuery } from "@/hooks/useFeedbackUser";

type Feedback = Tables<DBTables.Feedback>;
type FeedbackLikes = Tables<DBTables.FeedbackLikes>;
type ExtendFeedback = Feedback & {
  asGrid?: boolean;
  isLoaded?: boolean;
  showBrand?: boolean;
  likesCount?: number;
  dislikesCount?: number;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  hideReplyButton?: boolean;
  replyData?: FeedbackReplies;
  // beAnonymous?: boolean;
  // helpfulResponses?: string[];
  // unhelpfulResponses?: string[];
  // helpfulResponseCount: number;
  // unhelpfulResponseCount: number;
  // isHelpful: boolean;
  // isUnhelpful: boolean;
};

export default function FeedbackCard(
  props: ExtendFeedback & Partial<FeedbackLikes>,
) {
  const { theme } = useTheme();
  const { user } = useUser();
  // const [brandData, setBrandData] = React.useState<IBrands>();
  const isMounted = useIsMounted();
  const [userData, setUserData] = React.useState<IUser>();
  // const [isFollowed, setIsFollowed] = React.useState(false);
  // const { user, userDB } = useFeedbacksContext();
  const { data: userAndUserDB } = useUserAndUserDBQuery();
  const { userDB } = userAndUserDB || {};
  const { data: brandData } = useBrandById(props.recipient_id);
  const updateFeedbackLikes = useUpdateFeedbackLikes();
  const [clickedHelpfulResponses, setClickedHelpfulResponses] = React.useState<
    boolean | undefined
  >(props?.hasLiked);
  const [clickedUnHelpfulResponses, setClickedUnHelpfulResponses] =
    React.useState<boolean | undefined>(props?.hasDisliked);
  const [cachedAdder, setCachedAdder] = React.useState<number>(0);

  // const user: IProfile = FetchUserProfile(props.sender);
  // const userAddress = props.sender;
  // const isLoaded = props.isLoaded;

  useEffect(() => {
    /*async function getBrand() {
      const { data } = await BrandService.getBrandById(props.id);

      if (data && data.length > 0) {
        setBrandData(data[0]);
      }
    }
    getBrand();*/

    async function getUser() {
      const { data, error } = await supabase
        .from(DBTables.User)
        .select("*")
        .eq("email", props.email);

      if (error) {
        // console.error("Error fetching user", error);
      }
      if (data && data.length > 0) {
        setUserData(data[0]);
      }
    }

    getUser();
  }, [isMounted]);

  async function handleLikeResponse() {
    // setIsSubmit(true);
    const feedbackLikes = props?.likes ?? [];

    try {
      await updateFeedbackLikes.mutateAsync({
        id: props?.id,
        brand_id: props.recipient_id,
        feedback_id: props.id,
        likes: [...feedbackLikes, user?.primaryEmailAddress?.emailAddress!],
      });
      setCachedAdder(1);
    } catch (error) {
      toast.error("Error performing action. Try again soon.");
    } finally {
      // setIsSubmit(false);
      setClickedHelpfulResponses(!clickedHelpfulResponses);
    }
  }

  async function handleUnLikeResponse() {
    // setIsSubmit(true);
    const feedbackLikes = props?.likes ?? [];
    const updatedFeedbackLikes = feedbackLikes.filter(
      (email) => email !== user?.primaryEmailAddress?.emailAddress,
    );

    try {
      await updateFeedbackLikes.mutateAsync({
        id: props?.id,
        brand_id: props.recipient_id,
        feedback_id: props.id,
        likes: updatedFeedbackLikes,
      });
      setCachedAdder(0);
    } catch (error) {
      toast.error("Error performing action. Try again soon.");
    } finally {
      // setIsSubmit(false);
      setClickedHelpfulResponses(!clickedHelpfulResponses);
    }
  }

  async function handleDislikeResponse() {
    // setIsSubmit(true);
    const feedbackDislikes = props?.dislikes ?? [];

    try {
      await updateFeedbackLikes.mutateAsync({
        id: props?.id,
        brand_id: props.recipient_id,
        feedback_id: props.id,
        dislikes: [
          ...feedbackDislikes,
          user?.primaryEmailAddress?.emailAddress!,
        ],
      });
      setCachedAdder(1);
    } catch (error) {
      toast.error("Error performing action. Try again soon.");
    } finally {
      // setIsSubmit(false);
      setClickedUnHelpfulResponses(!clickedUnHelpfulResponses);
    }
  }

  async function handleUnDislikeResponse() {
    // setIsSubmit(true);
    const feedbackDislikes = props?.dislikes ?? [];
    const updatedFeedbackDislikes = feedbackDislikes.filter(
      (email) => email !== user?.primaryEmailAddress?.emailAddress,
    );

    try {
      await updateFeedbackLikes.mutateAsync({
        id: props?.id,
        brand_id: props.recipient_id,
        feedback_id: props.id,
        dislikes: updatedFeedbackDislikes,
      });
      setCachedAdder(0);
    } catch (error) {
      toast.error("Error performing action. Try again soon.");
    } finally {
      // setIsSubmit(false);
      setClickedUnHelpfulResponses(!clickedUnHelpfulResponses);
    }
  }

  return (
    <Card
      className={clsx(
        "min-w-[280px] lg:min-w-[360px]",
        props?.asGrid ? "h-[200px]" : "",
      )}
      classNames={{
        base: cn(props?.asGrid ? "px-0 py-1" : ""),
      }}
      shadow={props?.asGrid ? "sm" : "none"}
    >
      <CardHeader
        // as={"a"}
        className="justify-between items-center"
        // href={
        //   props?.email === user?.email
        //     ? "/app/me"
        //     : `/app/user/${userData?.userData?.user_metadata.user_name}`
        // }
      >
        <div className="flex gap-5">
          {props?.be_anonymous ? (
            <Avatar isBordered icon={<AvatarIcon />} size={"sm"} />
          ) : (
            <Avatar
              isBordered
              radius="full"
              size="sm"
              src={
                props?.email === user?.primaryEmailAddress?.emailAddress
                  ? userDB?.dp || user?.imageUrl
                  : userData?.dp || userData?.userData?.imageUrl
              }
            />
          )}

          <div className="flex flex-col gap-1 items-start justify-center">
            <Skeleton
              // isLoaded={!["", null, undefined].includes(user)}
              className="rounded-full"
              isLoaded={!!userData}
            >
              <h4 className="text-small font-semibold leading-none text-default-700">
                {props?.email === user?.primaryEmailAddress?.emailAddress
                  ? "You"
                  : props.be_anonymous
                    ? hashFullName(
                        userData?.userData?.fullName!,
                        user?.primaryEmailAddress?.emailAddress!,
                      )
                    : userData?.userData?.fullName}
              </h4>
            </Skeleton>
            {props?.showBrand && (
              <span className={"text-xs leading-none"}>
                to{" "}
                <Link
                  className={"font-bold text-xs"}
                  href={`/app/brand/${brandData?.name}`}
                >
                  {brandData?.raw_name}
                </Link>
              </span>
            )}
            <Skeleton className="rounded-full" isLoaded={!!props.email}>
              <h5 className="flex flex-col text-xs leading-none tracking-normal text-default-500">
                {formatDateString(props.created_at)}
              </h5>
            </Skeleton>
          </div>
          {props.be_anonymous && (
            <div className={"absolute right-2"}>
              <Chip
                className={"leading-none"}
                color="warning"
                size={"sm"}
                variant="flat"
              >
                Anonymous
              </Chip>
            </div>
          )}
        </div>
        {/*<Button
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
        </Button>*/}
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-600 leading-normal">
        <span>{props.description}</span>
        {/*<span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>*/}

        {props.replyData && (
          <Card
            className={"bg-default-100 dark:bg-background/40 my-3"}
            shadow={"none"}
          >
            <CardBody>
              <div className={"flex flex-row justify-between items-center"}>
                <div
                  className={
                    "font-medium text-default-400 text-[10px] leading-loose"
                  }
                >
                  Reply
                </div>
                <div
                  className={
                    "font-medium text-default-400 text-[10px] leading-loose"
                  }
                >
                  {formatDateString(props.replyData.created_at)}
                </div>
              </div>
              <p>{props.replyData.reply}</p>
            </CardBody>
          </Card>
        )}

        {props.screenshots && props.screenshots?.split(",")?.length > 0 && (
          <div className={"flex flex-row gap-x-2 py-2"}>
            {props.screenshots?.split(",").length > 0 &&
              props.screenshots
                ?.split(",")
                .map((eachScreenshot, index) => (
                  <Image
                    key={index}
                    alt="HeroUI hero Image"
                    className={"rounded"}
                    height={40}
                    src={eachScreenshot}
                  />
                ))}
          </div>
        )}
      </CardBody>
      <CardFooter className="justify-between gap-3 py-2">
        {/* <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">4</p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div> */}
        <div className="flex flex-row items-center gap-x-1">
          {/* TODO: Change length from 3 to a constant called FEEDBACK_STARS */}
          {Array.from({ length: 3 }).map((_, index) => (
            <>
              <StarItem
                key={index + 1}
                rating={index + 1}
                // @ts-ignore
                selectedRating={props.star_rating}
                setSelectedRating={() => null}
                size={"sm"}
              />
            </>
          ))}
        </div>

        <div className={"flex flex-row items-center gap-x-2"}>
          {props.recipient_id !== brandData?.id ? (
            // {brandData?.ownerEmail !== user?.primaryEmailAddress?.emailAddress ? (
            <div className={"flex flex-row items-center gap-x-2"}>
              {clickedHelpfulResponses && (
                <>
                  <span className={"font-bold text-xs"}>
                    {props?.likesCount! + cachedAdder || 0}
                  </span>
                  <Button
                    isIconOnly
                    color={"success"}
                    radius={"lg"}
                    size={"sm"}
                    variant={"flat"}
                    onPress={handleUnLikeResponse}
                  >
                    <LucideThumbsUp size={14} />
                  </Button>
                </>
              )}
              {clickedUnHelpfulResponses && (
                <>
                  <span className={"font-bold text-xs"}>
                    {props?.dislikesCount! + cachedAdder || 0}
                  </span>
                  <Button
                    isIconOnly
                    color={"danger"}
                    radius={"md"}
                    size={"sm"}
                    variant={"flat"}
                    onPress={handleUnDislikeResponse}
                  >
                    <LucideThumbsDown size={14} />
                  </Button>
                </>
              )}
              {!clickedHelpfulResponses && !clickedUnHelpfulResponses && (
                <ButtonGroup>
                  <Button
                    isIconOnly
                    color={"default"}
                    radius={"md"}
                    size={"sm"}
                    variant={theme === "dark" ? "flat" : "light"}
                    onPress={handleLikeResponse}
                    // onPress={() =>
                    //   setClickedHelpfulResponses(!clickedHelpfulResponses)
                    // }
                  >
                    <LucideThumbsUp size={14} />
                  </Button>
                  <Button
                    isIconOnly
                    radius={"md"}
                    size={"sm"}
                    variant={theme === "dark" ? "flat" : "light"}
                    onPress={handleDislikeResponse}
                  >
                    <LucideThumbsDown size={14} />
                  </Button>
                </ButtonGroup>
              )}
            </div>
          ) : (
            <div />
          )}
          {!props.hideReplyButton &&
            !props.replyData?.reply &&
            brandData?.owner_email ===
              user?.primaryEmailAddress?.emailAddress && (
              <ReplyFeedbackModal brandData={brandData!} feedbackData={props} />
            )}
        </div>
      </CardFooter>
      {/*<div className={"text-xs"}>12 people found this review helpful</div>*/}
    </Card>
  );
}
