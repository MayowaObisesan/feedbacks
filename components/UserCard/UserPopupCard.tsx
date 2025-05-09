import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import React from "react";

type T_UserPopupCard = {
  rawName: string;
  userName: string;
  bio: string;
  followingCount: number;
  followersCount: number;
};

export const UserPopupCard = ({
  rawName,
  userName,
  bio,
  followingCount,
  followersCount,
}: T_UserPopupCard) => {
  const [isFollowed, setIsFollowed] = React.useState(false);

  return (
    <Card className="max-w-[300px] border-none bg-transparent" shadow="none">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
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
      <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">
          {bio}
          <span aria-label="confetti" role="img">
            🎉
          </span>
        </p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">
            {followingCount}
          </p>
          <p className=" text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">
            {followersCount}
          </p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};
