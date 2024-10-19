"use client";

import { useFeedbacksContext } from "@/context";
import { IFeedbacks } from "@/types";
import { shortenAddress } from "@/utils";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";
import { Address } from "viem";
import { StarItem } from "../RatingStars/RatingComponent";

export default function FeedbackCard(props: IFeedbacks) {
  const [isFollowed, setIsFollowed] = React.useState(false);
  const { myProfileData } = useFeedbacksContext();
  const userName = props.sender;
  const userAddress = props.sender;
  const isLoaded = props.isLoaded;

  return (
    <Card
      className=""
      classNames={{
        base: "p-4",
      }}
    >
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://nextui.org/avatars/avatar-1.png"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <Skeleton
              // isLoaded={!["", null, undefined].includes(userName)}
              isLoaded={isLoaded}
              className="rounded-full"
            >
              <h4 className="text-small font-semibold leading-none text-default-600">
                {myProfileData?.name === userName ? "You" : userName}
              </h4>
            </Skeleton>
            <Skeleton
              isLoaded={![`0x{""}`, null, undefined].includes(userAddress)}
              className="rounded-full"
            >
              <h5 className="text-small tracking-tight text-default-400">
                @{shortenAddress(userAddress)}
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
        <span>{props.feedbackText}</span>
        <span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>
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
          {Array.from({ length: props.starRating }).map((_, index) => (
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
