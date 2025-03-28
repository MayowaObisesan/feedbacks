"use client";

import { Card, CardBody } from "@heroui/card";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";
import { SignedIn } from "@clerk/nextjs";
import { LucideArrowRight, LucideMessagesSquare } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "@heroui/spinner";

import FeedbackCard from "@/components/FeedbackCard";
import HomeNav from "@/components/homeNav";
import { TrendingBrandCard } from "@/components/TrendingCard";
import SearchModal from "@/components/Modals/SearchModal";
import CreateBrandModal from "@/components/Modals/CreateBrandModal";
import { useRealTimeBrands, useTrendingBrands } from "@/hooks/useBrands";
import TrendingBrandCardSkeleton from "@/components/Skeletons/TrendingBrandCardSkeleton";
import {
  useAllFeedbacks,
  useRealTimeFeedbacks,
  useTrendingFeedbacks,
} from "@/hooks/useFeedbacks";
import {
  FeedbackCardListSkeleton,
  FeedbackCardSkeleton,
} from "@/components/Skeletons/FeedbacksCardSkeleton";
import EmptyCard from "@/components/EmptyCard";
import { InfiniteFlatList } from "@/components/FlatList/infiniteFlatList";
import Link from "next/link";

export default function Home() {
  useRealTimeBrands();
  useRealTimeFeedbacks();
  const allFeedbacksLimit = 10;
  const allFeedbacksPageRef = useRef(1);
  const [allFeedbacksPage, setAllFeedbacksPage] = useState<number>(
    allFeedbacksPageRef.current,
  );
  const [allFeedbacksList, setAllFeedbacksList] = useState<any[]>([]);

  const {
    data: trendingBrands,
    error: trendingBrandsError,
    isLoading: trendingBrandsLoading,
    refetch: trendingBrandsRefetch,
  } = useTrendingBrands();
  const {
    data: trendingFeedbacks,
    error: trendingFeedbacksError,
    isLoading: trendingFeedbacksLoading,
    refetch: trendingFeedbacksRefetch,
  } = useTrendingFeedbacks(10);
  const {
    data: allFeedbacks,
    error: allFeedbacksError,
    isLoading: allFeedbacksLoading,
    isFetched: allFeedbacksIsFetched,
    refetch: allFeedbacksRefetch,
  } = useAllFeedbacks(10, allFeedbacksPage);
  const allFeedbackstotalPages = Math.ceil(
    allFeedbacks?.count! / allFeedbacksLimit,
  );

  const renderAllFeedbacksItem = (feedback: any) => (
    <FeedbackCard
      key={feedback.id}
      isLoaded={allFeedbacksIsFetched}
      {...feedback}
      showBrand={true}
    />
  );

  const updateFeedbacks = useCallback((newData: any[], currentPage: number) => {
    if (currentPage === 1) {
      // setHasMore(true);

      return setAllFeedbacksList(newData);
    }

    setAllFeedbacksList((prev) => {
      // Create a map of existing IDs for faster lookup
      const existingIds = new Map(prev.map((item) => [item.id, true]));

      // Filter out duplicates while maintaining order
      const uniqueNewData = newData.filter((item) => !existingIds.has(item.id));

      return [...prev, ...uniqueNewData];
    });
  }, []);

  useEffect(() => {
    if (allFeedbacks?.data) {
      updateFeedbacks(allFeedbacks.data, allFeedbacksPageRef.current);
      // setHasMore(pageRef.current < totalPages);
    }
  }, [
    allFeedbacks?.data,
    allFeedbacksPageRef.current,
    allFeedbackstotalPages,
    updateFeedbacks,
  ]);

  async function handleTrendingBrandsRefetch() {
    await trendingBrandsRefetch();
  }

  async function handleTrendingFeedbacksRefetch() {
    await trendingFeedbacksRefetch();
  }

  async function handleAllFeedbacksRefetch() {
    await allFeedbacksRefetch();
  }

  // Listen for user SIGNIN event
  /*supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN") {
      // console.log("SIGNED_IN", session);
      // Create the User table instance here.
      const { data, error } = await supabase
        .from(DBTables.User)
        .select("*")
        .eq("userId", session?.user.id);

      if (error) {
        // console.error("listen to signin event", error);
      }

      if (data && data.length === 0) {
        await supabase.from(DBTables.User).insert([
          {
            bio: "",
            email: session?.user.email,
            userId: session?.user.id,
            userData: session?.user,
          },
        ]);
      }
    }
  });*/

  // useContractEvent({ eventName: "BrandRegistered" });

  return (
    <section className="flex flex-col lg:flex-row w-full h-full gap-y-8 py-4">
      <section className="lg:h-full">
        <HomeNav />
      </section>
      <div className={"hidden"}>
        <SearchModal />
      </div>
      <section className="flex-1 space-y-12 md:px-2 lg:px-8 lg:overflow-x-hidden">
        {trendingBrandsError && (
          <div>
            <Alert
              color={"danger"}
              description={"Unable to fetch trending brands"}
              title={"Network error"}
            />
          </div>
        )}
        {/* Only show create brand modal for signed-in users */}
        {/*@ts-ignore*/}
        <SignedIn>
          <div className={"px-2"}>
            <CreateBrandModal />
          </div>
        </SignedIn>

        <section>
          <header className="flex flex-row justify-between items-center font-bold text-xl md:text-2xl lg:text-3xl leading-normal px-2">
            <div>Top Brands</div>
            <div className={"flex flex-row items-center md:px-4"}>
              {/*{(brandFeedbacksData as IFeedbacks[])?.length}*/}
              <Button
                as={Link}
                className={"max-sm:hidden"}
                endContent={<LucideArrowRight size={16} />}
                href={`/app/brand`}
                variant={"light"}
              >
                View more
              </Button>
              <Button
                isIconOnly
                as={Link}
                className={"md:hidden"}
                href={`/app/brand`}
                variant={"light"}
              >
                <LucideArrowRight size={20} strokeWidth={4} />
              </Button>
            </div>
          </header>
          {trendingBrandsLoading && (
            <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
              {Array.from({ length: 5 })?.map((_, index) => (
                <TrendingBrandCardSkeleton key={index} />
              ))}
            </div>
          )}
          {trendingBrands && (
            <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
              {trendingBrands?.map((eachTrendingBrand) => (
                <TrendingBrandCard
                  key={eachTrendingBrand.name}
                  avatarUrl={eachTrendingBrand.brand_image!}
                  description={eachTrendingBrand.description!}
                  feedbackCount={Number(eachTrendingBrand.feedback_count)}
                  name={eachTrendingBrand.name}
                  rawName={eachTrendingBrand.raw_name}
                />
              ))}
            </div>
          )}
          {trendingBrands?.length === 0 && (
            <Card className="bg-transparent shadow-none">
              <CardBody className="flex items-center justify-center h-[200px]">
                <div className="text-lg lg:text-xl text-gray-600 text-center leading-loose">
                  No trending brands.
                </div>
              </CardBody>
            </Card>
          )}
          {trendingBrandsError && (
            <Card className="bg-transparent shadow-none">
              <CardBody className="flex items-center justify-center h-[200px]">
                <div className="text-base lg:text-2xl text-gray-600 text-center text-pretty leading-loose">
                  Unable to fetch Brands.
                  <br />
                  Please check network connection.
                  <br />
                  <Button
                    variant={"flat"}
                    onPress={handleTrendingBrandsRefetch}
                  >
                    Try again
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </section>

        <section className="">
          <header className="font-bold text-xl md:text-3xl leading-normal px-2">
            Top Feedbacks
          </header>
          <ScrollShadow hideScrollBar orientation={"horizontal"} size={40}>
            <div className="flex flex-row gap-x-8 gap-y-2 px-2 py-4">
              {trendingFeedbacksLoading &&
                Array.from({ length: 5 })?.map((_, index) => (
                  <FeedbackCardSkeleton key={index} />
                ))}
              {trendingFeedbacks?.length === 0 && (
                <Card className="w-full bg-transparent shadow-none">
                  <CardBody className="flex items-center justify-center h-[200px]">
                    <div className="text-lg lg:text-xl text-gray-600 text-center leading-loose">
                      No trending feedbacks.
                    </div>
                  </CardBody>
                </Card>
              )}
              {trendingFeedbacks?.map((eachTrendingFeedback) => (
                <FeedbackCard
                  key={eachTrendingFeedback.id}
                  isLoaded={!trendingFeedbacksLoading}
                  {...eachTrendingFeedback}
                  asGrid={true}
                  showBrand={true}
                />
              ))}
              {trendingFeedbacksError && (
                <Card className="w-full bg-transparent shadow-none">
                  <CardBody className="flex items-center justify-center h-[200px]">
                    <div className="text-base lg:text-2xl text-gray-600 text-center text-pretty leading-loose">
                      Unable to fetch trending feedbacks.
                      <br />
                      Please check network connection.
                      <br />
                      <Button
                        variant={"flat"}
                        onPress={handleTrendingFeedbacksRefetch}
                      >
                        Try again
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </ScrollShadow>
        </section>

        <section className="">
          <header className="font-bold text-xl md:text-3xl leading-normal px-2">
            Latest Feedbacks
          </header>
          <ScrollShadow hideScrollBar orientation={"vertical"} size={80}>
            <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-2 md:px-2 py-4">
              {allFeedbacksLoading &&
                Array.from({ length: 5 })?.map((_, index) => (
                  <FeedbackCardListSkeleton key={index} />
                ))}
              {allFeedbacks?.data?.length === 0 && (
                <Card className="w-full bg-transparent shadow-none">
                  <CardBody className="flex items-center justify-center h-[200px]">
                    <div className="text-lg lg:text-xl text-gray-600 text-center leading-loose">
                      Empty feedbacks. <br />
                      You might want to check your network.
                    </div>
                  </CardBody>
                </Card>
              )}
              {/*{allFeedbacks?.data?.map((eachFeedback) => (
                <FeedbackCard
                  key={eachFeedback.id}
                  isLoaded={!allFeedbacksLoading}
                  {...eachFeedback}
                  showBrand={true}
                />
              ))}*/}
              {allFeedbacksError && (
                <Card className="w-full bg-transparent shadow-none">
                  <CardBody className="flex items-center justify-center h-[200px]">
                    <div className="text-base lg:text-2xl text-gray-600 text-center text-pretty leading-loose">
                      Unable to fetch latest feedbacks.
                      <br />
                      Please check network connection.
                      <br />
                      <Button
                        variant={"flat"}
                        onPress={handleAllFeedbacksRefetch}
                      >
                        Try again
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>

            <InfiniteFlatList
              ListEmptyComponent={
                <EmptyCard>
                  <div className={"flex flex-col items-center gap-y-5"}>
                    <LucideMessagesSquare
                      size={40}
                      strokeWidth={1}
                      width={"100%"}
                    />
                    <div className={"text-base lg:text-2xl text-balance"}>
                      Wow. No feedback to fetch.
                    </div>
                  </div>
                </EmptyCard>
              }
              ListFooterComponent={
                <>
                  {!allFeedbacksIsFetched && (
                    <div className={"p-4 text-center"}>
                      <Spinner size={"lg"} />
                    </div>
                  )}
                  {allFeedbacksIsFetched &&
                    allFeedbacksPage === allFeedbackstotalPages && (
                      <div className="p-4 text-center">
                        <p>No more feedbacks to load</p>
                      </div>
                    )}
                  {/*{allFeedbacksPage < allFeedbackstotalPages ? (
                    allFeedbacksLoading ? (
                      <div className="p-4 text-center">
                        <p>Loading more...</p>
                      </div>
                    ) : null
                  ) : (
                    <div className="p-4 text-center">
                      <p>No more feedbacks to load</p>
                    </div>
                  )}*/}
                </>
              }
              contentContainerClassName="flex flex-col gap-y-2 lg:px-2 py-4"
              // initialNumToRender={10}
              keyExtractor={(item) => item.id.toString()}
              // maxToRenderPerBatch={10}
              renderItem={renderAllFeedbacksItem}
              renderedData={allFeedbacksList}
              onEndReached={() => {
                // Only fetch more if we're not already fetching and there are more pages
                if (
                  allFeedbacksIsFetched &&
                  allFeedbacksPageRef.current < allFeedbackstotalPages
                ) {
                  allFeedbacksPageRef.current += 1;
                  setAllFeedbacksPage(allFeedbacksPageRef.current);
                }
              }}
              onEndReachedThreshold={0.5}
            />
          </ScrollShadow>
        </section>
      </section>
    </section>
  );
}
