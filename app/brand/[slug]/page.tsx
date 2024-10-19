"use client";

import BrandNav from "@/components/BrandNav";
import { CreateEventModal } from "@/components/CreateEventModal";
import EmptyCard from "@/components/EmptyCard";
import EventInviteCard from "@/components/EventInviteCard";
import FeedbackCard from "@/components/FeedbackCard";
import { CreateFeedbackModal } from "@/components/Modals/CreateFeedbackModal";
import { CreateProductModal } from "@/components/Modals/CreateProductModal";
import UpdateBrandModal from "@/components/Modals/UpdateBrandModal";
import ProductCard from "@/components/ProductCard";
import { useFeedbacksContext } from "@/context";
import { useProduct } from "@/hooks/useProduct";
import useRead, {
  useBrandRead,
  useFeedbackRead,
  useProductRead,
} from "@/hooks/useRead";
import { IBrands, IEvents, IFeedbacks, IProduct, IProfile } from "@/types";
import { Skeleton } from "@nextui-org/skeleton";
import { useCallback, useEffect } from "react";
import { Address } from "viem";

function BrandPage({ params }: { params: any }) {
  const { myAddress, myEventInvites, multipleEventsInvitesData } =
    useFeedbacksContext();
  const { data } = useBrandRead({
    functionName: "getAllBrands",
    args: [params.slug, "0x0000000000000000000000000000000000000000", ""],
  });
  console.log(data);
  const brandData: IBrands = (data as IBrands) ? data[0] : null;

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
  console.log(productData);

  const {
    data: brandFeedbacksData,
    isFetching: isBrandFeedbacksDataFetching,
    isSuccess: isBrandFeedbacksDataSuccessful,
  } = useFeedbackRead({
    functionName: "getAllFeedbacks",
    args: [myAddress, 0, 0, 0],
  });

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
        <div className="relative h-full overflow-y-auto">
          <BrandNav brandName={params.slug} />
        </div>
        <section className="flex flex-col justify-center items-center gap-y-24 w-full h-full overflow-hidden">
          <div className="text-center">
            <div>Your brand page is a bit empty.</div>
            <div>Start an engagement with some of this actions.</div>
          </div>

          <section className="flex flex-col items-center gap-y-5">
            <div>
              {brandData?.owner === myAddress && (
                <UpdateBrandModal
                  brandId={brandData ? brandData?.brandId : null}
                />
              )}
            </div>
            <div className="my-4 space-x-4">
              <CreateFeedbackModal
                brandId={brandData ? brandData?.brandId : null}
              />
              {brandData?.owner === myAddress && (
                <>
                  <CreateEventModal
                    brandId={brandData ? brandData?.brandId : null}
                  />
                  <CreateProductModal
                    brandId={brandData ? brandData?.brandId : null}
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
    <section className="flex flex-col lg:flex-row w-ful h-full py-4 overflow-hidden">
      <div className="relative min-w-60 h-full overflow-y-auto">
        <BrandNav brandName={params.slug} />
      </div>

      <section className="w-full h-full overflow-y-auto px-4">
        <header className="font-bold text-4xl leading-normal">
          Your Feedbacks - {(brandFeedbacksData as IFeedbacks[])?.length}
        </header>
        <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
          {!isBrandFeedbacksDataFetching ? (
            <>
              {(brandFeedbacksData as IFeedbacks[]) ? (
                (brandFeedbacksData as IFeedbacks[])?.map((_) => (
                  <FeedbackCard
                    key={_.feedbackId}
                    // userName={fetchSender(_.sender)?.name}
                    {..._}
                    isLoaded={!["", null, undefined].includes(_.sender)}
                  />
                ))
              ) : (
                <EmptyCard>You haven't received any feedback yet</EmptyCard>
              )}
            </>
          ) : (
            [1, 2, 3, 4, 5]?.map((_) => (
              <Skeleton
                isLoaded={!isBrandFeedbacksDataFetching}
                className="rounded-lg"
              >
                <FeedbackCard
                  key={_}
                  isLoaded={!isBrandFeedbacksDataFetching}
                  // userName={fetchSender(_.sender)?.name}
                  {..._}
                />
              </Skeleton>
            ))
          )}
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

        <section className="">
          <header className="font-bold text-4xl leading-normal">
            Your Products
          </header>
          <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
            {(productData as IProduct[])?.map((eachBrandProduct) => (
              <ProductCard
                key={eachBrandProduct.productId}
                {...eachBrandProduct}
              />
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}

export default BrandPage;
