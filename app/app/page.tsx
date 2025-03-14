"use client";

import { Card, CardBody } from "@heroui/card";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";

import { supabase } from "@/utils/supabase/supabase";
import FeedbackCard from "@/components/FeedbackCard";
import HomeNav from "@/components/homeNav";
import { TrendingBrandCard } from "@/components/TrendingCard";
import { useFeedbacksContext } from "@/context";
import { DBTables } from "@/types/enums";
import SearchModal from "@/components/Modals/SearchModal";
import CreateBrandModal from "@/components/Modals/CreateBrandModal";
import { useTrendingBrands } from "@/hooks/useBrands";
import TrendingBrandCardSkeleton from "@/components/Skeletons/TrendingBrandCardSkeleton";
import { useAllFeedbacks, useTrendingFeedbacks } from "@/hooks/useFeedbacks";
import {
  FeedbackCardListSkeleton,
  FeedbackCardSkeleton,
} from "@/components/Skeletons/FeedbacksCardSkeleton";

export default function Home() {
  const { userDB } = useFeedbacksContext();
  const {
    data: trendingBrands,
    error: trendingBrandsError,
    isLoading: trendingBrandsLoading,
  } = useTrendingBrands();
  const { data: trendingFeedbacks, isLoading: trendingFeedbacksLoading } =
    useTrendingFeedbacks(10);
  const { data: allFeedbacks, isLoading: allFeedbacksLoading } =
    useAllFeedbacks(10);

  // Listen for user SIGNIN event
  supabase.auth.onAuthStateChange(async (event, session) => {
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
  });

  // useContractEvent({ eventName: "BrandRegistered" });

  return (
    <section className="flex flex-col lg:flex-row w-full h-full gap-y-8 py-4">
      <section className="lg:h-full">
        <HomeNav />
      </section>
      <div className={"hidden"}>
        <SearchModal />
      </div>
      <section className="space-y-12 px-2 lg:px-8 lg:overflow-y-hidden">
        {trendingBrandsError && (
          <div>
            <Alert color={"danger"} title={"Unable to fetch trending brands"} />
          </div>
        )}
        {/* Only show create brand modal for signed-in users */}
        {userDB?.email && (
          <div className={""}>
            <CreateBrandModal />
          </div>
        )}

        <section>
          <header className="font-bold text-xl md:text-4xl leading-normal">
            Trending Brands
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
                  avatarUrl={eachTrendingBrand.brandImage!}
                  description={eachTrendingBrand.description!}
                  feedbackCount={Number(eachTrendingBrand.feedbackCount)}
                  name={eachTrendingBrand.name}
                  rawName={eachTrendingBrand.rawName}
                />
              ))}
            </div>
          )}
          {trendingBrands?.length === 0 && (
            <Card className="bg-transparent shadow-none">
              <CardBody className="flex items-center justify-center h-[200px]">
                <div className="text-xl lg:text-3xl text-gray-600 text-center leading-loose">
                  No trending brands.
                  <br />
                  <Button>Try again</Button>
                </div>
              </CardBody>
            </Card>
          )}
          {trendingBrandsError && (
            <Card className="bg-transparent shadow-none">
              <CardBody className="flex items-center justify-center h-[200px]">
                <div className="text-lg lg:text-3xl text-gray-600 text-center text-pretty leading-loose">
                  Unable to fetch Brands.
                  <br />
                  Please check network connection.
                </div>
              </CardBody>
            </Card>
          )}
        </section>

        <section className="">
          <header className="font-bold text-xl md:text-4xl leading-normal">
            Trending Feedbacks
          </header>
          <ScrollShadow hideScrollBar orientation={"horizontal"} size={40}>
            <div className="flex flex-row gap-x-8 gap-y-2 px-2 py-4">
              {trendingFeedbacksLoading &&
                Array.from({ length: 5 })?.map((_, index) => (
                  <FeedbackCardSkeleton key={index} />
                ))}
              {trendingFeedbacks?.map((eachTrendingFeedback) => (
                <FeedbackCard
                  key={eachTrendingFeedback.id}
                  isLoaded={!trendingFeedbacksLoading}
                  {...eachTrendingFeedback}
                  asGrid={true}
                  showBrand={true}
                />
              ))}
            </div>
          </ScrollShadow>
        </section>

        <section className="">
          <header className="font-bold text-xl md:text-4xl leading-normal">
            Latest Feedbacks
          </header>
          <ScrollShadow hideScrollBar orientation={"vertical"} size={80}>
            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-2 px-2 py-4">
              {allFeedbacksLoading &&
                Array.from({ length: 5 })?.map((_, index) => (
                  <FeedbackCardListSkeleton key={index} />
                ))}
              {allFeedbacks?.data?.map((eachFeedback) => (
                <FeedbackCard
                  key={eachFeedback.id}
                  isLoaded={!allFeedbacksLoading}
                  {...eachFeedback}
                  showBrand={true}
                />
              ))}
            </div>
          </ScrollShadow>
        </section>
      </section>
    </section>
  );
}
