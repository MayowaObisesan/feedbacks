"use client";

import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import {
  LucideArrowRight,
  LucideChevronRight,
  LucideMessagesSquare,
} from "lucide-react";
import Link from "next/link";
import { Divider } from "@heroui/divider";
import { Alert } from "@heroui/alert";
import React from "react";

import BrandNav from "@/components/BrandNav";
import { CreateEventModal } from "@/components/CreateEventModal";
import EmptyCard from "@/components/EmptyCard";
import FeedbackCard from "@/components/FeedbackCard";
import { CreateFeedbackModal } from "@/components/Modals/CreateFeedbackModal";
import { CreateProductModal } from "@/components/Modals/CreateProductModal";
import UpdateBrandModal from "@/components/Modals/UpdateBrandModal";
import { useFeedbacksContext } from "@/context";
import { useBrandByName } from "@/hooks/useBrands";
import { FeedbackCardListSkeleton } from "@/components/Skeletons/FeedbacksCardSkeleton";
import { useBrandFeedbacks } from "@/hooks/useFeedbacks";

function BrandPage({ params }: { params: any }) {
  // @ts-ignore
  const { slug } = React.use(params);
  const { myAddress, myEventInvites, user } = useFeedbacksContext();
  const {
    data: brandData,
    error: brandError,
    isFetched: brandIsFetched,
  } = useBrandByName(slug);
  const {
    data: brandFeedbacksData,
    isFetching: brandFeedbacksIsFetching,
    isFetched: brandFeedbacksIsFetched,
  } = useBrandFeedbacks(brandData?.id!);

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
    brandFeedbacksData?.length === 0 &&
    myEventInvites?.length === 0
    // && (productData as IProduct[])?.length === 0
  ) {
    return (
      <section className="flex flex-col lg:flex-row w-ful h-full py-4 overflow-hidden">
        <div className="relative lg:h-full overflow-y-auto">
          <BrandNav
            brandData={brandData!}
            brandName={slug}
            isBrandDataSuccessful={brandIsFetched}
          />
        </div>
        <section className="flex flex-col justify-center items-center gap-y-24 w-full h-full overflow-hidden">
          {brandError && (
            <Alert>Error fetching brand. Pls check network Connection.</Alert>
          )}
          <div className="text-center">
            <div>Your brand page is a bit empty.</div>
            <div>Start an engagement with some of this actions.</div>
          </div>

          <section className="flex flex-col items-center gap-y-5">
            <div>
              {brandData?.ownerEmail === myAddress && (
                <UpdateBrandModal brandId={brandData ? brandData?.id : null} />
              )}
            </div>
            <div className="my-4 space-x-4">
              <CreateFeedbackModal brandId={brandData ? brandData?.id : null} />
              {brandData?.ownerEmail !== user?.email && (
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
          </section>
        </section>
      </section>
    );
  }

  return (
    <section className="flex flex-col md:flex-row w-ful h-full md:py-4 overflow-auto md:overflow-hidden">
      <div className="relative min-w-72 md:h-full md:overflow-y-auto">
        <BrandNav
          brandData={brandData!}
          brandName={slug}
          isBrandDataSuccessful={brandIsFetched}
        />
      </div>

      <Divider className="md:hidden my-2" />

      <section className="w-full h-full md:overflow-y-auto lg:px-4 space-y-8">
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
          <header className="flex flex-row justify-between items-center max-md:px-4 font-bold text-lg md:text-3xl leading-normal">
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
                <LucideChevronRight size={20} strokeWidth={4} />
              </Button>
            </div>
          </header>
          <ScrollShadow
            hideScrollBar
            className="w-full px-4"
            orientation={"vertical"}
          >
            <div className="flex flex-col flex-nowrap gap-x-8 gap-y-2 lg:px-2 py-4">
              {brandFeedbacksIsFetching &&
                Array.from({ length: 5 }).map((_, index: number) => (
                  <FeedbackCardListSkeleton key={index} />
                ))}
              {brandFeedbacksIsFetched &&
                brandFeedbacksData?.map((_) => (
                  <FeedbackCard
                    key={_.id}
                    // userName={fetchSender(_.sender)?.name}
                    {..._}
                    asGrid={false}
                    isLoaded={!["", null, undefined].includes(_.email)}
                  />
                ))}
              {brandFeedbacksIsFetched && brandFeedbacksData?.length === 0 && (
                <EmptyCard>
                  <div className={"flex flex-col items-center gap-y-5"}>
                    <LucideMessagesSquare
                      size={40}
                      strokeWidth={1}
                      width={"100%"}
                    />
                    <div className={"text-lg lg:text-2xl text-balance"}>
                      You haven&apos;t received any feedback yet
                    </div>
                  </div>
                </EmptyCard>
              )}

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
    </section>
  );
}

export default BrandPage;
