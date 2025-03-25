"use client";

import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import {
  LucideArrowRight,
  LucideHome,
  LucideLayoutTemplate,
  LucideMessagesSquare,
} from "lucide-react";
import Link from "next/link";
import { Divider } from "@heroui/divider";
import { Alert } from "@heroui/alert";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { useUser } from "@clerk/nextjs";

import BrandNav from "@/components/BrandNav";
import EmptyCard from "@/components/EmptyCard";
import FeedbackCard from "@/components/FeedbackCard";
import {
  useBrandByName,
  useRealTimeBrands,
  useRealTimeBrandsFollowers,
} from "@/hooks/useBrands";
import { FeedbackCardListSkeleton } from "@/components/Skeletons/FeedbacksCardSkeleton";
import {
  useBrandFeedbacks,
  useRealTimeFeedbacks,
  useStarRatingCounts,
} from "@/hooks/useFeedbacks";
import RatingAggregate from "@/components/RatingAggregate";
import { InfiniteFlatList } from "@/components/FlatList/infiniteFlatList";
import RatingAggregateSkeleton from "@/components/Skeletons/RatingAggregateSkeleton";

function BrandPage({ params }: { params: any }) {
  useRealTimeFeedbacks();
  useRealTimeBrands();
  useRealTimeBrandsFollowers();

  // @ts-ignore
  const { slug } = React.use(params);
  const { user } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pageRef = useRef(1);
  const [page, setPage] = useState<number>(pageRef.current);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 10;
  const {
    data: brandData,
    error: brandError,
    isFetched: brandIsFetched,
  } = useBrandByName(slug, user?.id);
  const {
    data: brandFeedbacksData,
    isFetching: brandFeedbacksIsFetching,
    isFetched: brandFeedbacksIsFetched,
  } = useBrandFeedbacks(
    brandData?.id!,
    user?.primaryEmailAddress?.emailAddress,
    pageRef.current,
    limit,
  );
  const { data: ratingData, isFetched: ratingDataFetched } =
    useStarRatingCounts(brandData?.id!);
  const totalPages = Math.ceil(brandFeedbacksData?.count! / limit);

  /*const distribution = [1, 2, 3].map((rating, index) => ({
    rating,
    count: starCounts?.[index] || 0,
  }));

  const totalFeedbacks = brandData?.feedback_count!;

  const averageRating =
    starCounts && Math.max(...starCounts) > 0
      ? Math.round(((Math.max(...starCounts) / totalFeedbacks) * 100) / 3) / 10
      : 0;

  const ratingData = {
    // averageRating: totalFeedbacks > 0 ? ratingSum / totalFeedbacks : 0,
    averageRating: averageRating,
    totalRatings: totalFeedbacks,
    /!*distribution: [
      { rating: 5, count: 600 },
      { rating: 4, count: 400 },
      { rating: 3, count: 150 },
      { rating: 2, count: 50 },
      { rating: 1, count: 34 },
    ],*!/
    distribution,
  };*/

  const renderFeedbackItem = (feedback: any) => (
    <FeedbackCard
      key={feedback.id}
      {...feedback}
      asGrid={false}
      isLoaded={!["", null, undefined].includes(feedback.email)}
    />
  );

  const updateFeedbacks = useCallback((newData: any[], currentPage: number) => {
    if (currentPage === 1) {
      setHasMore(true);

      return setFeedbacks(newData);
    }

    setFeedbacks((prev) => {
      // Create a map of existing IDs for faster lookup
      const existingIds = new Map(prev.map((item) => [item.id, true]));

      // Filter out duplicates while maintaining order
      const uniqueNewData = newData.filter((item) => !existingIds.has(item.id));

      return [...prev, ...uniqueNewData];
    });
  }, []);

  useEffect(() => {
    if (brandFeedbacksData?.data) {
      updateFeedbacks(brandFeedbacksData.data, pageRef.current);
      setHasMore(pageRef.current < totalPages);
    }
  }, [brandFeedbacksData?.data, pageRef.current, totalPages, updateFeedbacks]);

  // const [brandData, setBrandData] = useState<IBrands>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isThisBrandDataFetching, setIsThisBrandDataFetching] =
  //   useState<boolean>(false);
  // const [isThisBrandDataSuccessful, setIsThisBrandDataSuccessful] =
  //   useState<boolean>(false);

  // const [brandFeedbacksData, setBrandFeedbacksData] = useState<IFeedbacks[]>(
  //   []
  // );
  // const [
  //   isThisBrandFeedbacksDataFetching,
  //   setIsThisBrandFeedbacksDataFetching
  // ] = useState<boolean>(false);
  // const [
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   isThisBrandFeedbacksDataSuccessful,
  //   setIsThisBrandFeedbacksDataSuccessful
  // ] = useState<boolean>(false);

  /*useEffect(() => {
    async function getBrand() {
      // Initialize loading states
      setIsThisBrandDataFetching(true);
      setIsThisBrandDataSuccessful(false);

      let { data: brand, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("name", params.slug)
        .range(0, 9);

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
    getBrand();

    // get Feedback
    async function getFeedbacks(brandId: number) {
      // Initialize loading states
      setIsThisBrandFeedbacksDataFetching(true);
      setIsThisBrandFeedbacksDataSuccessful(false);

      let { data: feedbacks, error } = await supabase
        .from(DBTables.Feedback)
        .select("*")
        .eq("recipientId", brandId)
        .range(0, 9);

      // console.log("feedbacks", feedbacks);

      if (feedbacks && feedbacks.length > 0) {
        setBrandFeedbacksData(feedbacks);

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
  }, []);*/

  /*const { data } = useBrandRead({
    functionName: "getAllBrands",
    args: [params.slug, "0x0000000000000000000000000000000000000000", ""],
  });
  console.log(data);*/
  // const brandData: IBrands = (data as IBrands) ? data[0] : null;

  // useEffect(() => {
  //   const fetchSender = (_senderAddress: Address): IProfile => {
  //     const { data: profile, isFetching: isProfileFetching } = useRead({
  //       functionName: "getProfile",
  //       args: [_senderAddress],
  //     });
  //     return data as unknown as IProfile;
  //   };
  // }, []);

  /*const {
    data: productData,
    isFetching: isProductDataFetching,
    isSuccess: isProductDataSuccessful,
  } = useProductRead({
    functionName: "getAllProducts",
    args: [brandData?.brandId, ""],
  });*/
  // console.log(productData);
  // console.log(multipleEventsInvitesData);

  /*const {
    data: brandFeedbacksData,
    isFetching: isBrandFeedbacksDataFetching,
    isSuccess: isBrandFeedbacksDataSuccessful,
  } = useFeedbackRead({
    functionName: "getAllFeedbacks",
    args: [myAddress, 0, 0, 0],
  });*/

  // useEffect(() => {
  //   if (data) {
  //     const { productData } = useProduct(data && data[0]?.brandId);
  //     console.log(productData);
  //   }
  // }, [data]);

  if (
    brandFeedbacksData?.data?.length === 0
    // && myEventInvites?.length === 0
    // && (productData as IProduct[])?.length === 0
  ) {
    return (
      <section className={"md:h-full md:overflow-hidden"}>
        <div className={"sticky top-0 z-40 p-4 bg-background"}>
          <Breadcrumbs>
            <BreadcrumbItem
              href={"/app"}
              startContent={<LucideHome size={15} />}
            >
              Home
            </BreadcrumbItem>
            <BreadcrumbItem
              href={"/app/brand"}
              startContent={<LucideLayoutTemplate size={15} />}
            >
              Brands
            </BreadcrumbItem>
            <BreadcrumbItem>{brandData?.raw_name}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        <section className="flex flex-col md:flex-row w-ful h-full py-4 md:overflow-hidden">
          <div className="flex-1 relative md:min-w-72 md:max-w-72 md:h-dvh">
            <BrandNav
              brandData={brandData!}
              brandName={slug}
              isBrandDataSuccessful={brandIsFetched}
            />
          </div>
          <section className="flex-1 flex flex-col justify-center items-center w-full h-full overflow-hidden">
            {brandError && (
              <Alert
                color={"danger"}
                description={
                  "Error fetching brand. Pls check network Connection"
                }
              />
            )}
            <div className="text-center">
              <div>Your brand page is a bit empty.</div>
              <div>Start an engagement with some of these actions.</div>
            </div>

            {/*<section className="flex flex-col items-center gap-y-5">
              <div>
                {brandData?.owner_email === user?.primaryEmailAddress?.emailAddress && (
                  <UpdateBrandModal brandId={brandData ? brandData?.id : null} />
                )}
              </div>
              <div className="my-4 space-x-4">
                <CreateFeedbackModal brandId={brandData ? brandData?.id : null} />
                {brandData?.owner_email !==
                  user?.primaryEmailAddress?.emailAddress && (
                  <>
                    <CreateEventModal
                      brandId={brandData ? brandData?.id : null}
                    />
                    <CreateProductModal
                      brandId={brandData ? brandData?.id : null}
                    />
                  </>
                )}
              </div>
            </section>*/}
          </section>
        </section>
      </section>
    );
  }

  return (
    <section className={"md:h-full md:overflow-hidden"}>
      <div className={"sticky top-0 z-40 p-4 bg-background"}>
        <Breadcrumbs>
          <BreadcrumbItem href={"/app"} startContent={<LucideHome size={15} />}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem
            href={"/app/brand"}
            startContent={<LucideLayoutTemplate size={15} />}
          >
            Brands
          </BreadcrumbItem>
          <BreadcrumbItem>{brandData?.raw_name}</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <section className="relative flex flex-col md:flex-row w-ful h-full md:py-4">
        <div className="flex-1 relative md:min-w-72 md:max-w-72 md:h-dvh">
          <BrandNav
            brandData={brandData!}
            brandName={slug}
            isBrandDataSuccessful={brandIsFetched}
          />
        </div>

        <Divider className="md:hidden my-2" />

        <ScrollShadow hideScrollBar className={"flex-1"} size={8}>
          <section className="lg:px-4 space-y-8">
            {/*<div className="sticky top-0 z-50 flex w-full items-center gap-x-3 border-divider bg-background/40 px-6 py-2 backdrop-blur-xl sm:px-3.5 sm:before:flex-1">
              <div className="w-full font-bold text-2xl">{brandData?.rawName}</div>
              {myEventInvites?.length > 0 && (
                <span>
                  <Badge content={myEventInvites?.length} color="danger">
                    <Button
                      radius="full"
                      isIconOnly
                      aria-label={`more than ${myEventInvites?.length}`}
                      variant="light"
                    >
                      <NotificationIcon />
                    </Button>
                  </Badge>
                </span>
              )}
            </div>*/}

            <section>
              {ratingDataFetched && ratingData ? (
                <RatingAggregate {...ratingData} />
              ) : (
                <RatingAggregateSkeleton />
              )}
              <header className="flex flex-row justify-between items-center px-4 font-bold text-base md:text-3xl leading-normal">
                <div>Your Feedbacks</div>
                <div className={"flex flex-row items-center md:px-4"}>
                  {/*{(brandFeedbacksData as IFeedbacks[])?.length}*/}
                  <Button
                    as={Link}
                    className={"max-sm:hidden"}
                    endContent={<LucideArrowRight size={16} />}
                    href={`/app/more?brandFeedbacks=${slug}`}
                    variant={"light"}
                  >
                    View more
                  </Button>
                  <Button
                    isIconOnly
                    className={"md:hidden"}
                    href={`/app/more?brandFeedbacks=${slug}`}
                    variant={"light"}
                  >
                    <LucideArrowRight size={20} strokeWidth={4} />
                  </Button>
                </div>
              </header>

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
                        You haven&apos;t received any feedback yet
                      </div>
                    </div>
                  </EmptyCard>
                }
                ListFooterComponent={
                  page < totalPages ? (
                    !brandFeedbacksIsFetched ? (
                      <div className="p-4 text-center">
                        <p>Loading more...</p>
                      </div>
                    ) : null
                  ) : (
                    <div className="p-4 text-center">
                      <p>No more feedbacks to load</p>
                    </div>
                  )
                }
                contentContainerClassName="flex flex-col gap-y-2 lg:px-2 py-4"
                // initialNumToRender={10}
                keyExtractor={(item) => item.id.toString()}
                // maxToRenderPerBatch={10}
                renderItem={renderFeedbackItem}
                renderedData={feedbacks}
                onEndReached={() => {
                  // Only fetch more if we're not already fetching and there are more pages
                  if (brandFeedbacksIsFetched && pageRef.current < totalPages) {
                    pageRef.current += 1;
                    setPage(pageRef.current);
                  }
                }}
                onEndReachedThreshold={0.5}
              />

              <ScrollShadow
                hideScrollBar
                className="w-full px-4 md:py-8"
                orientation={"vertical"}
              >
                <div className="flex flex-col flex-nowrap gap-x-8 gap-y-2 lg:px-2 py-4">
                  {brandFeedbacksData?.count! <= 10 &&
                    brandFeedbacksIsFetching &&
                    Array.from({ length: 5 }).map((_, index: number) => (
                      <FeedbackCardListSkeleton key={index} />
                    ))}
                  {/*{brandFeedbacksIsFetched &&
                    brandFeedbacksData?.data?.map((_) => (
                      <FeedbackCard
                        key={_.id}
                        // userName={fetchSender(_.sender)?.name}
                        {..._}
                        asGrid={false}
                        isLoaded={!["", null, undefined].includes(_.email)}
                      />
                    ))}
                  {brandFeedbacksIsFetched &&
                    brandFeedbacksData?.data?.length === 0 && (
                      <EmptyCard>
                        <div className={"flex flex-col items-center gap-y-5"}>
                          <LucideMessagesSquare
                            size={40}
                            strokeWidth={1}
                            width={"100%"}
                          />
                          <div className={"text-base lg:text-2xl text-balance"}>
                            You haven&apos;t received any feedback yet
                          </div>
                        </div>
                      </EmptyCard>
                    )}*/}

                  {/*{brandFeedbacksIsFetched && (
                  )}*/}

                  {/*{!isThisBrandFeedbacksDataFetching ? (
                    <>
                      {(brandFeedbacksData as IFeedbacks[]) ? (
                        (brandFeedbacksData as IFeedbacks[])?.map((_) => (
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
                        <FeedbackCard
                          isLoaded={!isThisBrandFeedbacksDataFetching}
                          // userName={fetchSender(_.sender)?.name}
                          {..._}
                        />
                      </Skeleton>
                    ))
                  )}*/}
                </div>
              </ScrollShadow>
            </section>

            {/*{brandFeedbacksData && brandFeedbacksData?.length > 0 ? (
            ) : (
              <EmptyCard>
                <div
                  className={"flex flex-col justify-center items-center gap-y-4"}
                >
                  <LucideMessageSquareQuote
                    className={"text-content4"}
                    size={40}
                    strokeWidth={2}
                  />
                  <div className={"text-xl text-foreground-400"}>
                    You haven&apos;t received any feedbacks yet
                  </div>
                </div>
              </EmptyCard>
            )}*/}

            {/*<section className="md:px-6">
              <header className="relative flex flex-row justify-between items-center font-bold text-lg lg:text-2xl leading-normal">
                <div>Event Invitations</div>
                <div className={"flex flex-row items-center md:px-4"}>
                  <Button
                    as={Link}
                    className="max-sm:hidden"
                    endContent={<LucideChevronRight />}
                    href=""
                    variant="light"
                  >
                    View more
                  </Button>
                  <Button isIconOnly className={"md:hidden"} variant={"light"}>
                    <LucideChevronRight size={20} strokeWidth={4} />
                  </Button>
                </div>
              </header>
              <ScrollShadow
                hideScrollBar
                className="w-full"
                orientation={"horizontal"}
              >
                <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4">
                  {myEventInvites?.length > 0 &&
                    (multipleEventsInvitesData as IEvents[])?.map(
                      (eachEventInvite) => (
                        <EventInviteCard
                          key={eachEventInvite.eventBasicInfo.eventId}
                          {...eachEventInvite}
                        />
                      ),
                    )}
                </div>
              </ScrollShadow>
            </section>*/}

            {/*<section className="space-y-3 md:px-6">
              <header className="relative flex flex-row justify-between items-center font-bold text-2xl leading-normal">
                <div>Your Products</div>
                <div className={"flex flex-row items-center md:px-4"}>
                  <Button
                    as={Link}
                    className="max-sm:hidden"
                    endContent={<LucideChevronRight />}
                    href=""
                    variant="light"
                  >
                    View more
                  </Button>
                  <Button isIconOnly className={"md:hidden"} variant={"light"}>
                    <LucideChevronRight size={20} strokeWidth={4} />
                  </Button>
                </div>
              </header>
              <ScrollShadow
                hideScrollBar
                className="w-full"
                orientation={"horizontal"}
              >
                <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4">
                  {(productData as IProduct[])?.map((eachBrandProduct) => (
                    <ProductCard
                      key={eachBrandProduct.productId}
                      {...eachBrandProduct}
                    />
                  ))}
                </div>
              </ScrollShadow>
            </section>*/}

            {/*<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/NECBCxEFMCo?si=jLmvKIYpbDhOHbi0"
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>*/}
          </section>
        </ScrollShadow>
      </section>
    </section>
  );
}

export default BrandPage;
