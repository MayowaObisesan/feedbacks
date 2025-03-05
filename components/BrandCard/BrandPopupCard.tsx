import { BRAND_ABI, BRAND_ADDRESS } from "@/constant";
import { useFeedbacksContext } from "@/context";
import { useBrandRead } from "@/hooks/useRead";
import { parseImageHash } from "@/utils";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";
import { useWriteContract } from "wagmi";

type T_BrandPopupCard = {
  brandId: number;
  imageHash: string;
  rawName: string;
  userName: string;
  description?: string;
  followingCount?: number;
  followersCount?: number;
  feedbackCount?: number;
};

export const BrandPopupCard = ({
  brandId,
  imageHash,
  rawName,
  userName,
  description,
  followingCount,
  followersCount,
  feedbackCount,
}: T_BrandPopupCard) => {
  const { myAddress } = useFeedbacksContext();
  //   const [isFollowed, setIsFollowed] = React.useState(false);

  const {
    data: followingData,
    isFetching: isFollowingDataFetching,
    isStale: isFollowingDataStale,
    isSuccess: isFollowingDataSuccessful,
  } = useBrandRead({
    functionName: "isFollowing",
    args: [brandId, myAddress],
  });

  const { writeContract, isPending, isSuccess, isError } = useWriteContract();

  const handleFollowBrand = () => {
    // setIsFollowed(!isFollowed);
    writeContract({
      abi: BRAND_ABI,
      address: BRAND_ADDRESS,
      functionName: "followBrand",
      args: [brandId],
    });
  };

  const handleUnfollowBrand = () => {
    // setIsFollowed(!isFollowed);
    writeContract({
      abi: BRAND_ABI,
      address: BRAND_ADDRESS,
      functionName: "unfollowBrand",
      args: [brandId],
    });
  };

  return (
    <Card shadow="none" className="w-[300px] border-none bg-transparent">
      <CardHeader className="justify-between">
        <div className="flex flex-auto gap-3 w-full">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={parseImageHash(imageHash)}
          />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {rawName}
            </h4>
            <h5 className="text-small tracking-tight text-default-500">
              @{userName}
            </h5>
          </div>
        </div>
        <Skeleton isLoaded={!isFollowingDataFetching} className="rounded-full">
          <Button
            className={followingData ? "" : ""}
            color={followingData ? "danger" : "primary"}
            radius="full"
            size="sm"
            variant={followingData ? "flat" : "solid"}
            onPress={followingData ? handleUnfollowBrand : handleFollowBrand}
          >
            {followingData ? "Unfollow" : "Follow"}
          </Button>
        </Skeleton>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">
          {description}
          <span aria-label="confetti" role="img">
            🎉
          </span>
        </p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">
            {Number(followingCount) || 0}
          </p>
          <p className=" text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">
            {Number(followersCount)}
          </p>
          <p className="text-default-500 text-small">
            {Number(followersCount) === 1 ? "Follower" : "Followers"}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
