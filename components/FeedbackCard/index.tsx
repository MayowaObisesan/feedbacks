"use client";

import { Avatar } from "@nextui-org/avatar";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import React, { useEffect } from "react";
import { useIsMounted } from "usehooks-ts";

import { StarItem } from "../RatingStars/RatingComponent";

import { useFeedbacksContext } from "@/context";
import { IFeedbacks, IUser } from "@/types";
import { DBTables } from "@/types/enums";
import { supabase } from "@/utils/supabase/supabase";

export default function FeedbackCard(props: IFeedbacks) {
  // const [brandData, setBrandData] = React.useState<IBrands>();
  const isMounted = useIsMounted();
  const [userData, setUserData] = React.useState<IUser>();
  // const [isFollowed, setIsFollowed] = React.useState(false);
  const { user, userDB } = useFeedbacksContext();
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

  return (
    <Card
      className="min-w-[280px] lg:min-w-[360px] h-[200px]"
      classNames={{
        base: "p-4",
      }}
    >
      <CardHeader
        as={"a"}
        className="justify-between"
        href={
          props?.email === user?.email
            ? "me"
            : `user/${userData?.userData?.user_metadata.user_name}`
        }
      >
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={
              props?.email === user?.email
                ? userDB?.dp || user?.user_metadata.avatar_url
                : userData?.dp || userData?.userData?.user_metadata.avatar_url
            }
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <Skeleton
              // isLoaded={!["", null, undefined].includes(user)}
              className="rounded-full"
              isLoaded={!!userData}
            >
              <h4 className="text-small font-semibold leading-none text-default-600">
                {props?.email === user?.email
                  ? "You"
                  : userData?.userData?.user_metadata.full_name}
              </h4>
            </Skeleton>
            <Skeleton className="rounded-full" isLoaded={!!props.email}>
              <h5 className="text-small tracking-tight text-default-400">
                {props.email}
              </h5>
            </Skeleton>
          </div>
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
      <CardBody className="px-3 py-0 text-small text-default-400">
        <span>{props.description}</span>
        {/*<span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>*/}
      </CardBody>
      <CardFooter className="gap-3">
        {/* <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">4</p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">97.1K</p>
          <p className="text-default-400 text-small">Followers</p>
        </div> */}
        <div className="flex flex-row items-center">
          {/* TODO: Change length from 3 to a constant called FEEDBACK_STARS */}
          {Array.from({ length: 3 }).map((_, index) => (
            <>
              <StarItem
                key={index + 1}
                rating={index + 1}
                selectedRating={props.starRating}
                setSelectedRating={() => null}
              />
            </>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
