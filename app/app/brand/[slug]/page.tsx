"use client";

import BrandNav from "@/components/BrandNav";
import { CreateEventModal } from "@/components/CreateEventModal";
import EmptyCard from "@/components/EmptyCard";
import EventInviteCard from "@/components/EventInviteCard";
import FeedbackCard from "@/components/FeedbackCard";
import { NotificationIcon } from "@/components/icons";
import { CreateFeedbackModal } from "@/components/Modals/CreateFeedbackModal";
import { CreateProductModal } from "@/components/Modals/CreateProductModal";
import UpdateBrandModal from "@/components/Modals/UpdateBrandModal";
import ProductCard from "@/components/ProductCard";
import { useFeedbacksContext } from "@/context";
import useRead, {
  useBrandRead,
  useFeedbackRead,
  useProductRead,
} from "@/hooks/useRead";
import { IBrands, IEvents, IFeedbacks, IProduct, IProfile } from "@/types";
import { Badge } from "@nextui-org/badge";
import { Button } from "@nextui-org/button";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Skeleton } from "@nextui-org/skeleton";
import { LucideArrowRight, LucideChevronRight, LucideCircleSlash, LucideMailPlus, LucideZoomOut } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Address } from "viem";
import { supabase } from "@/utils/supabase/supabase";
import { DBTables, E_DeviceWidth } from "@/types/enums";
import { Divider } from "@nextui-org/divider";
import { useWindowSize } from "usehooks-ts";
import FeedbacksUI from "@/components/sdk";
import EmbedGeneratorPage from "@/app/app/embed-generator/page";
import EmbedFeedbacksGenerator from "@/components/sdk/EmbedFeedbacksGenerator";

function BrandPage({ params }: { params: any }) {
  const { myAddress, myEventInvites, multipleEventsInvitesData, user } =
    useFeedbacksContext();
  const size = useWindowSize();
  const [brandData, setBrandData] = useState<IBrands>();
  const [isThisBrandDataFetching, setIsThisBrandDataFetching] = useState<boolean>(false);
  const [isThisBrandDataSuccessful, setIsThisBrandDataSuccessful] = useState<boolean>(false);

  const [brandFeedbacksData, setBrandFeedbacksData] = useState<IFeedbacks[]>([]);
  const [isThisBrandFeedbacksDataFetching, setIsThisBrandFeedbacksDataFetching] = useState<boolean>(false);
  const [isThisBrandFeedbacksDataSuccessful, setIsThisBrandFeedbacksDataSuccessful] = useState<boolean>(false);

  useEffect(() => {
    async function getBrand() {
      // Initialize loading states
      setIsThisBrandDataFetching(true)
      setIsThisBrandDataSuccessful(false)

      let { data: brand, error } = await supabase
        .from(DBTables.Brand)
        .select('*')
        .eq('name', params.slug)
        .range(0, 9);

      if (brand && brand.length > 0) {
        setBrandData(brand[0] as unknown as IBrands)

        // Finalize loading states
        setIsThisBrandDataFetching(false)
        setIsThisBrandDataSuccessful(true)

        getFeedbacks(brand[0].id)
      }

      if (error) {
        // Finalize loading states
        setIsThisBrandDataFetching(false)
        setIsThisBrandDataSuccessful(false)

        console.error("Error fetching brand data", error)
      }
    }
    getBrand();

    // get Feedback
    async function getFeedbacks(brandId: number) {
      // Initialize loading states
      setIsThisBrandFeedbacksDataFetching(true)
      setIsThisBrandFeedbacksDataSuccessful(false)

      let { data: feedbacks, error } = await supabase
        .from(DBTables.Feedback)
        .select('*')
        .eq('recipientId', brandId)
        .range(0, 9);

      console.log("feedbacks", feedbacks);

      if (feedbacks && feedbacks.length > 0) {
        setBrandFeedbacksData(feedbacks)

        // Finalize loading states
        setIsThisBrandFeedbacksDataFetching(false)
        setIsThisBrandFeedbacksDataSuccessful(true)
      }

      if (error) {
        // Finalize loading states
        setIsThisBrandFeedbacksDataFetching(false)
        setIsThisBrandFeedbacksDataSuccessful(false)

        console.error("Error fetching brand data", error)
      }
    }
  }, []);

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

  const {
    data: productData,
    isFetching: isProductDataFetching,
    isSuccess: isProductDataSuccessful,
  } = useProductRead({
    functionName: "getAllProducts",
    args: [brandData?.brandId, ""],
  });
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

  useEffect(() => {
    const fetchSender = () => {};
  }, []);

  // useEffect(() => {
  //   if (data) {
  //     const { productData } = useProduct(data && data[0]?.brandId);
  //     console.log(productData);
  //   }
  // }, [data]);

  if (
    (brandFeedbacksData as IFeedbacks[])?.length === 0 &&
    myEventInvites?.length === 0 &&
    (productData as IProduct[])?.length === 0
  ) {
    return (
      <section className="flex flex-col lg:flex-row w-ful h-full py-4 overflow-hidden">
        <div className="relative lg:h-full overflow-y-auto">
          <BrandNav brandName={params.slug} brandData={brandData!} isBrandDataSuccessful={isThisBrandDataSuccessful} />
        </div>
        <section className="flex flex-col justify-center items-center gap-y-24 w-full h-full overflow-hidden">
          <div className="text-center">
            <div>Your brand page is a bit empty.</div>
            <div>Start an engagement with some of this actions.</div>
          </div>

          <section className="flex flex-col items-center gap-y-5">
            <div>
              {brandData?.ownerEmail === myAddress && (
                <UpdateBrandModal
                  brandId={brandData ? brandData?.id : null}
                />
              )}
            </div>
            <div className="my-4 space-x-4">
              <CreateFeedbackModal
                brandId={brandData ? brandData?.id : null}
              />
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
        <BrandNav brandName={params.slug} brandData={brandData!} isBrandDataSuccessful={isThisBrandDataSuccessful} />
      </div>

      <Divider className="md:hidden my-2" />

      <section className="w-full h-full md:overflow-y-auto px-4 space-y-8">
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

        {(brandFeedbacksData as IFeedbacks[])?.length > 0
          ? (
            <section>
            <header
              className="flex flex-row justify-between items-center font-bold text-2xl md:text-3xl leading-normal">
              <div>Your Feedbacks</div>
              <div className={"flex flex-row items-center md:px-4"}>
                {/*{(brandFeedbacksData as IFeedbacks[])?.length}*/}
                <Button
                  as={Link}
                  variant={"light"}
                  endContent={<LucideArrowRight size={16} />}
                  className={"max-sm:hidden"}
                  href={`/app/more?brandFeedbacks=${params.slug}`}
                >
                  View more
                </Button>
                <Button
                  variant={"light"}
                  isIconOnly
                  className={"md:hidden"}
                  href={`/app/more?brandFeedbacks=${params.slug}`}>
                  <LucideChevronRight
                    size={20}
                    strokeWidth={4} />
                </Button>
              </div>
            </header>
            <ScrollShadow className="w-full" hideScrollBar orientation={"horizontal"}>
              <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4">
                {!isThisBrandFeedbacksDataFetching ? (
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
                        You haven't received any feedback yet
                      </EmptyCard>
                    )}
                  </>
                ) : (
                  [1, 2, 3, 4, 5]?.map((_) => (
                    <Skeleton
                      isLoaded={!isThisBrandFeedbacksDataFetching}
                      className="rounded-lg"
                    >
                      <FeedbackCard
                        key={_}
                        isLoaded={!isThisBrandFeedbacksDataFetching}
                        // userName={fetchSender(_.sender)?.name}
                        {..._}
                      />
                    </Skeleton>
                  ))
                )}
              </div>
            </ScrollShadow>
          </section>
        )
          : <EmptyCard>
            <div className={"flex flex-col justify-center align-center"}>
              <div><LucideZoomOut size={48} strokeWidth={2} className={"text-content4"} /></div>
              <div className={"text-xl text-foreground-400"}>You haven't received any feedbacks yet</div>
            </div>
          </EmptyCard>
        }

        <section className="md:px-6">
          <header className="relative flex flex-row justify-between items-center font-bold text-2xl leading-normal">
            <div>Event Invitations</div>
            <div className={"flex flex-row items-center md:px-4"}>
              <Button
                as={Link}
                href=""
                variant="light"
                className="max-sm:hidden"
                endContent={<LucideChevronRight />}
              >
                View more
              </Button>
              <Button
                variant={"light"}
                isIconOnly
                className={"md:hidden"}>
                <LucideChevronRight size={20} strokeWidth={4} />
              </Button>
            </div>
          </header>
          <ScrollShadow className="w-full" hideScrollBar orientation={"horizontal"}>
            <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4">
              {myEventInvites?.length > 0 &&
                (multipleEventsInvitesData as IEvents[])?.map(
                  (eachEventInvite) => (
                    <EventInviteCard
                      key={eachEventInvite.eventBasicInfo.eventId}
                      {...eachEventInvite}
                    />
                  )
                )}
            </div>
          </ScrollShadow>
        </section>

        <section className="space-y-3 md:px-6">
          <header className="relative flex flex-row justify-between items-center font-bold text-2xl leading-normal">
            <div>Your Products</div>
            <div className={"flex flex-row items-center md:px-4"}>
              <Button
                as={Link}
                href=""
                variant="light"
                className="max-sm:hidden"
                endContent={<LucideChevronRight />}
              >
                View more
              </Button>
              <Button
                variant={"light"}
                isIconOnly
                className={"md:hidden"}>
                <LucideChevronRight size={20} strokeWidth={4} />
              </Button>
            </div>
          </header>
          <ScrollShadow className="w-full" hideScrollBar orientation={"horizontal"}>
            <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4">
              {(productData as IProduct[])?.map((eachBrandProduct) => (
                <ProductCard
                  key={eachBrandProduct.productId}
                  {...eachBrandProduct}
                />
              ))}
            </div>
          </ScrollShadow>
        </section>

        {/*<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/NECBCxEFMCo?si=jLmvKIYpbDhOHbi0"
                title="YouTube video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>*/}
      </section>
    </section>
  );
}

export default BrandPage;
