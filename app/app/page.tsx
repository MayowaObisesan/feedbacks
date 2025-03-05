"use client";

import { supabase } from "@/utils/supabase/supabase";
import FeedbackCard from "@/components/FeedbackCard";
import HomeNav from "@/components/homeNav";
import { TrendingBrandCard } from "@/components/TrendingCard";
import { FEEDBACK_ADDRESS, FEEDBACKS_ABI } from "@/constant";
import { useFeedbacksContext } from "@/context";
import useContractEvent from "@/hooks/useContractEvent";
import { Card, CardBody } from "@nextui-org/card";
import { useReadContract } from "wagmi";
import { DBTables } from "@/types/enums";
import SearchModal from "@/components/Modals/SearchModal";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import CreateBrandModal from "@/components/Modals/CreateBrandModal";


const AllBrands = ({ _name = "", _owner = "" }) => {
  const { data, isLoading, isFetched, isSuccess, isPlaceholderData } =
    useReadContract({
      abi: FEEDBACKS_ABI,
      address: FEEDBACK_ADDRESS,
      functionName: "getAllBrands",
      args: [_name, _owner]
    });

  return { data, isLoading, isFetched, isSuccess, isPlaceholderData };
};

export default function Home() {
  const { allBrandsData, mySentFeedbacksData, profileExist, trendingBrandsData, userDB } = useFeedbacksContext();

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
        console.error("listen to signin event", error);
      }

      if (data && data.length === 0) {
        await supabase.from(DBTables.User).insert([
          {
            bio: "",
            email: session?.user.email,
            userId: session?.user.id,
            userData: session?.user
          }
        ]);
      }
    }
  });

  useContractEvent({ eventName: "BrandRegistered" });

  const trendingBrands = [
    {
      name: "Samsung",
      feedbackCount: 15000
    },
    {
      name: "AirBnB",
      feedbackCount: 25000
    },
    {
      name: "Chivita",
      feedbackCount: 16000
    }
  ];

  return (
    <section className="flex flex-col lg:flex-row w-full h-full gap-y-8 py-4">
      <section className="lg:h-full">
        <HomeNav />
      </section>
      <div className={"hidden"}>
        <SearchModal />
      </div>
      <section className="space-y-12 px-2 lg:px-8 lg:overflow-y-hidden">
        {/* Only show create brand modal for signed-in users */}
        {
          userDB?.email
          && <div className={""}>
            <CreateBrandModal />
          </div>
        }

        {/*{!profileExist && (
          <Card className="inline-flex">
            <CardBody>
              <div className="flex flex-row items-center gap-x-4 text-center">
                <span>Set your username for your account.</span>
                <CreateProfileModal buttonText="Add username" />
              </div>
            </CardBody>
          </Card>
        )}*/}
        <section>
          <header className="font-extrabold text-2xl md:text-4xl leading-normal">
            Trending Brands
          </header>
          {trendingBrandsData ? (
            <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
              {allBrandsData?.map((eachTrendingBrand) => (
                <TrendingBrandCard
                  key={eachTrendingBrand.name}
                  name={eachTrendingBrand.name}
                  rawName={eachTrendingBrand.rawName}
                  feedbackCount={Number(eachTrendingBrand.feedbackCount)}
                  description={eachTrendingBrand.description}
                  avatarUrl={eachTrendingBrand.brandImage}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-transparent shadow-none">
              <CardBody className="flex items-center justify-center h-[200px]">
                <div className="text-3xl text-gray-600 text-center leading-loose">
                  No trending brands.
                  <br />
                  Strange...
                </div>
              </CardBody>
            </Card>
          )}
        </section>

        <section className="">
          <header className="font-bold text-2xl md:text-4xl leading-normal">
            Trending Feedbacks
          </header>
          <ScrollShadow hideScrollBar orientation={"horizontal"} size={80}>
            <div className="flex flex-row gap-x-8 px-2 py-4">
              {mySentFeedbacksData?.map((eachTrendingFeedback) => (
                <FeedbackCard
                  key={eachTrendingFeedback.id}
                  isLoaded={!!mySentFeedbacksData}
                  {...eachTrendingFeedback}
                />
              ))}
            </div>
          </ScrollShadow>
        </section>
      </section>
    </section>
  );
}
