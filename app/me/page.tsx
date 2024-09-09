"use client";

import FeedbackCard from "@/components/FeedbackCard";
import { TrendingCard } from "@/components/TrendingCard";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import React from "react";
import { useAccount } from "wagmi";

const ProfileCard = () => {
  const [isFollowed, setIsFollowed] = React.useState(false);
  const { address, isConnected } = useAccount();

  return (
    <Card className="min-w-[340px] max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://nextui.org/avatars/avatar-1.png"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Zoey Lang
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @zoeylang - {address}
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
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>
          Frontend developer and UI/UX enthusiast. Join me on this coding
          adventure!
        </p>
        <span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">4</p>
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
  return (
    <section className="flex flex-row flex-nowrap">
      <section className="sticky top-20 h-full">
        <ProfileCard />
      </section>
      <section className="space-y-8 py-4 px-8 lg:overflow-y-hidden">
        <section>
          <header className="font-bold text-4xl leading-normal">
            Brands you follow
          </header>
          <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
            {["1", "2", "3", "4"].map((eachBrand) => (
              <TrendingCard />
            ))}
          </div>
        </section>

        <section>
          <header className="font-bold text-4xl leading-normal">
            Your Feedback
          </header>
          <div className="flex flex-col gap-4 px-2 py-4">
            {["1", "2", "3", "4", "5", "6"].map((eachBrand) => (
              <FeedbackCard />
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
