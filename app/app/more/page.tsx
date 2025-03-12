"use client";

import React, { ReactElement, Suspense, useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { useSearchParams } from "next/navigation";
import { LucideBadgeMinus } from "lucide-react";
import { Card, CardBody } from "@nextui-org/card";
import { Listbox } from "@nextui-org/listbox";
import { Button } from "@nextui-org/button";

import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";
import { IBrands, IFeedbacks } from "@/types";
import FeedbackCard from "@/components/FeedbackCard";
import EmptyCard from "@/components/EmptyCard";
import { FeedbackCardSkeleton } from "@/components/Skeletons/FeedbacksCardSkeleton";
import { TrendingBrandCard } from "@/components/TrendingCard";
import CreateBrandModal from "@/components/Modals/CreateBrandModal";
import { useFeedbacksContext } from "@/context";

/*
// This is the page where all load-more are displayed.
For example;
1. If I click load more feedbacks, it redirects me to this page and load all the feedbacks I intended for me.
2. If I click load more brands, it redirects to this page and load all the brands I intended.
3. And so on...

How this can be simplified is to have a component built for all the load more parameters that can exist on Feedbacks.
How?
1. Create a component for All Feedbacks to be loaded with scroll load more.
2. Create a component for all products to be loaded with scroll load more.
3. Create a component for certain feedbacks to be loaded with scroll load more based on filter parameters. i.e., the component
will take in a parameter, either the user whose feedbacks is to be fetched and infinite scrolled "load-mored", etc.
4. Create a component for certain brands, either a user's brands, trending brands, category of brands, each of these
are parameters passed to the components.
*/

function MorePageContent() {
  const searchParams = useSearchParams();
  // const searchParams = new URLSearchParams(window.location.search);

  const brandFeedbacks = searchParams.get("brandFeedbacks");
  const myBrands = searchParams.get("myBrands");
  // const brands = searchParams.get("brands");
  const DEFAULT_LOAD_COUNT = 5;

  /* Load More All Brands */

  /*function loadMoreAllBrands() {
    return <></>;
  }*/

  function LoadMoreMyBrands() {
    const { user } = useFeedbacksContext();
    const [myBrandsData, setMyBrandsData] = React.useState<IBrands[]>([]);
    // const [sentFeedbacks, setSentFeedbacks] = React.useState<IFeedbacks[]>([]);
    const [isMyBrandsDataFetching, setIsMyBrandsDataFetching] =
      React.useState<boolean>(false);

    useEffect(() => {
      getMyBrands();
    }, [user]);

    async function getMyBrands() {
      setIsMyBrandsDataFetching(true);

      try {
        const { data, error } = await supabase
          .from(DBTables.Brand)
          .select("*")
          .eq("ownerEmail", user?.email)
          .range(0, 99);

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

    return (
      <Listbox
        isVirtualized
        className="max-w-xs"
        label={"Select from 10000 items"}
        // placeholder="Select..."
        // virtualization={{
        //   itemHeight: 80,
        // }}
      >
        {!isMyBrandsDataFetching ? (
          <>
            {(myBrandsData as IBrands[])?.length > 0 ? (
              (myBrandsData as IBrands[])?.map((eachBrand) => (
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
                <LucideBadgeMinus size={40} strokeWidth={1} width={"100%"} />
                <div className={"text-2xl text-balance"}>
                  You haven&apos;t listed any brand yet
                </div>

                <CreateBrandModal />
              </EmptyCard>
            )}
          </>
        ) : (
          [1, 2, 3, 4].map((_) => (
            <Card
              key={_}
              as={"button"}
              className="min-w-[280px] lg:min-w-[360px] h-[200px]"
            >
              <CardBody className="flex flex-col justify-center px-8">
                <Skeleton
                  className={"w-5/6 h-12 mt-4 rounded-full"}
                  isLoaded={false}
                >
                  <div className="font-normal text-5xl leading-normal text-ellipsis whitespace-nowrap overflow-hidden">
                    &nbsp;
                  </div>
                </Skeleton>
              </CardBody>
              <Skeleton className="absolute left-8 bottom-8 w-2/6 h-4 font-extrabold text-sm rounded-full" />
            </Card>
          ))
        )}
      </Listbox>
    );
  }

  function LoadMoreBrandsFeedbacks({
    brandName,
  }: {
    brandName: string;
  }): ReactElement {
    const [
      isThisBrandFeedbacksDataFetching,
      setIsThisBrandFeedbacksDataFetching,
    ] = useState<boolean>(false);
    const [
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isThisBrandFeedbacksDataSuccessful,
      setIsThisBrandFeedbacksDataSuccessful,
    ] = useState<boolean>(false);
    const [brandFeedbacksData, setBrandFeedbacksData] = useState<IFeedbacks[]>(
      [],
    );
    const [moreBrandFeedbacksData, setMoreBrandFeedbacksData] = useState<
      IFeedbacks[]
    >([]);
    const [brandData, setBrandData] = useState<IBrands>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isThisBrandDataFetching, setIsThisBrandDataFetching] =
      useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isThisBrandDataSuccessful, setIsThisBrandDataSuccessful] =
      useState<boolean>(false);
    const [totalBrandFeedbackCount, setTotalBrandFeedbackCount] = useState(0);
    const [isMoreFetching, setIsMoreFetching] = useState<boolean>(false);

    useEffect(() => {
      getBrand();
    }, [brandName]);

    async function getBrand() {
      // Initialize loading states
      setIsThisBrandDataFetching(true);
      setIsThisBrandDataSuccessful(false);

      let { data: brand, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("name", brandName)
        .range(0, 10);

      if (brand && brand.length > 0) {
        setBrandData(brand[0] as unknown as IBrands);

        // Finalize loading states
        setIsThisBrandDataFetching(false);
        setIsThisBrandDataSuccessful(true);

        getFeedbacks(brand[0].id);
      }

      if (error) {
        // Finalize loading states
        setIsThisBrandDataFetching(false);
        setIsThisBrandDataSuccessful(false);

        // console.error("Error fetching brand data", error);
      }
    }

    // get Feedback
    async function getFeedbacks(brandId: number) {
      // Initialize loading states
      setIsThisBrandFeedbacksDataFetching(true);
      setIsThisBrandFeedbacksDataSuccessful(false);

      let {
        count,
        data: feedbacks,
        error,
      } = await supabase
        .from(DBTables.Feedback)
        .select("*", { count: "exact", head: false })
        .eq("recipientId", brandId)
        .range(0, 4);

      // console.log("feedbacks", feedbacks, count);

      if (feedbacks && feedbacks.length > 0) {
        setBrandFeedbacksData(feedbacks);
        setTotalBrandFeedbackCount(count!);

        // Finalize loading states
        setIsThisBrandFeedbacksDataFetching(false);
        setIsThisBrandFeedbacksDataSuccessful(true);
      }

      if (error) {
        // Finalize loading states
        setIsThisBrandFeedbacksDataFetching(false);
        setIsThisBrandFeedbacksDataSuccessful(false);

        // console.error("Error fetching brand data", error);
      }
    }

    // get More Feedback
    async function getMoreFeedbacks(brandId: number) {
      // Initialize loading states
      setIsMoreFetching(true);

      const startRange =
        brandFeedbacksData?.length + moreBrandFeedbacksData.length;
      const endRange = startRange + (DEFAULT_LOAD_COUNT - 1);
      let { data: feedbacks, error } = await supabase
        .from(DBTables.Feedback)
        .select("*")
        .eq("recipientId", brandId)
        .range(startRange, endRange);

      if (feedbacks && feedbacks.length > 0) {
        setMoreBrandFeedbacksData((prevState) => {
          return [...prevState, ...(feedbacks as IFeedbacks[])];
        });

        // Finalize loading states
        setIsMoreFetching(false);
      }

      if (error) {
        // Finalize loading states
        setIsMoreFetching(false);

        // console.error("Error fetching brand data", error);
      }
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <section className={"flex flex-col justify-start gap-y-2 py-2 h-full"}>
          <div className={"font-normal text-xl px-4"}>
            <b>{brandData?.rawName}</b> Feedbacks
          </div>
          <ScrollShadow
            hideScrollBar
            className="w-full"
            orientation={"vertical"}
          >
            <div className="lg:grid lg:grid-cols-3 max-md:flex max-md:flex-col max-md:flex-nowrap gap-x-8 gap-y-2 px-2 py-4">
              {!isThisBrandFeedbacksDataFetching ? (
                <>
                  {(brandFeedbacksData as IFeedbacks[]) ? (
                    (brandFeedbacksData as IFeedbacks[])?.map((_) => (
                      // @ts-ignore
                      <FeedbackCard
                        key={_.id}
                        // userName={fetchSender(_.sender)?.name}
                        {..._}
                        isLoaded={!["", null, undefined].includes(_.email)}
                      />
                    ))
                  ) : (
                    <EmptyCard>
                      You haven&apos;t received any feedback yet
                    </EmptyCard>
                  )}
                </>
              ) : (
                [1, 2, 3, 4, 5]?.map((_) => (
                  <Skeleton
                    key={_}
                    className="rounded-lg"
                    isLoaded={!isThisBrandFeedbacksDataFetching}
                  >
                    {/*  TODO: CREATE A FEEDBACKS CARD SKELETON*/}
                    <FeedbackCardSkeleton />
                  </Skeleton>
                ))
              )}
              {!isMoreFetching &&
                moreBrandFeedbacksData.length > 0 &&
                moreBrandFeedbacksData.map((_) => (
                  // @ts-ignore
                  <FeedbackCard key={_.id} {..._} isLoaded={!isMoreFetching} />
                ))}
            </div>
          </ScrollShadow>
          {brandFeedbacksData.length + moreBrandFeedbacksData.length <
            totalBrandFeedbackCount && (
            <Button
              isLoading={isMoreFetching}
              onPress={() => getMoreFeedbacks(brandData?.id!)}
            >
              Load more
            </Button>
          )}
        </section>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section>
        {/*<div>Load More Page</div>*/}
        {brandFeedbacks && (
          <LoadMoreBrandsFeedbacks brandName={brandFeedbacks} />
        )}

        {myBrands && <LoadMoreMyBrands />}
      </section>
    </Suspense>
  );
}

export default function LoadMorePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MorePageContent />
    </Suspense>
  );
}
