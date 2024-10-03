"use client";

import BrandNav from "@/components/BrandNav";
import EventInviteCard from "@/components/EventInviteCard";
import FeedbackCard from "@/components/FeedbackCard";
import { useFeedbacksContext } from "@/context";
import useRead from "@/hooks/useRead";
import { IEvents, IFeedbacks, IProfile } from "@/types";
import { useEffect } from "react";
import { Address } from "viem";

function BrandPage({ params }: { params: any }) {
  const { myAddress, myEventInvites, multipleEventsInvitesData } =
    useFeedbacksContext();
  const { data } = useRead({
    functionName: "getAllBrands",
    args: [params.slug, "0x0000000000000000000000000000000000000000"],
  });
  console.log(data);

  useEffect(() => {
    const fetchSender = (_senderAddress: Address): IProfile => {
      const { data: profile, isFetching: isProfileFetching } = useRead({
        functionName: "getProfile",
        args: [_senderAddress],
      });
      return data as unknown as IProfile;
    };
  }, []);

  const {
    data: brandFeedbacksData,
    isFetching: isBrandFeedbacksDataFetching,
    isSuccess: isBrandFeedbacksDataSuccessful,
  } = useRead({
    functionName: "getAllFeedbacks",
    args: [myAddress, 0, 0, 0],
  });

  useEffect(() => {
    const fetchSender = () => {};
  }, []);

  return (
    <section className="flex flex-col lg:flex-row w-full h-full py-4">
      <div className="h-full">
        <BrandNav brandName={params.slug} />
      </div>

      <section className="w-full grow shrink-0">
        <header className="font-bold text-4xl leading-normal">
          Your Feedbacks - {(brandFeedbacksData as IFeedbacks[])?.length}
        </header>
        <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
          {(brandFeedbacksData as IFeedbacks[])?.map((_) => (
            <FeedbackCard
              key={_.feedbackId}
              // userName={fetchSender(_.sender)?.name}
              {..._}
            />
          ))}
        </div>

        <section className="">
          <header className="font-bold text-4xl leading-normal">
            Event Feedback Invitation
          </header>
          <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
            {(multipleEventsInvitesData as IEvents[])?.map(
              (eachEventInvite) => (
                <EventInviteCard
                  key={eachEventInvite.eventId}
                  {...eachEventInvite}
                />
              )
            )}
          </div>
        </section>
      </section>
    </section>
  );
}

export default BrandPage;
