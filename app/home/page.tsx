"use client";

import FeedbackCard from "@/components/FeedbackCard";
import HomeNav from "@/components/homeNav";
import { TrendingBrandCard, TrendingCard } from "@/components/TrendingCard";
import { FEEDBACKS_ABI } from "@/constant";
import { Card, CardBody } from "@nextui-org/card";
import { useReadContract } from "wagmi";

export default function Home() {
  const result = useReadContract({
    abi: FEEDBACKS_ABI,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    functionName: "balanceOf",
    args: ["0x6b175474e89094c44da98b954eedeac495271d0f"],
  });
  const trendingBrands = [
    {
      name: "Samsung",
      feedbackCount: 15000,
    },
    {
      name: "AirBnB",
      feedbackCount: 25000,
    },
    {
      name: "Chivita",
      feedbackCount: 16000,
    },
  ];
  return (
    <section className="flex flex-col lg:flex-row w-full h-full py-4">
      {<div></div>}
      <section className="h-full">
        <HomeNav />
      </section>
      <section className="space-y-8 px-8 lg:overflow-y-hidden">
        <section>
          <header className="font-bold text-6xl leading-normal">
            Trending Brands
          </header>
          {trendingBrands.length > 0 ? (
            <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
              {trendingBrands.map((eachTrendingBrand) => (
                <TrendingBrandCard
                  name={eachTrendingBrand.name}
                  feedbackCount={eachTrendingBrand.feedbackCount}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-transparent">
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
          <header className="font-bold text-4xl leading-normal">
            Trending Feedbacks
          </header>
          <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
            {trendingBrands.map((eachTrendingBrand) => (
              <FeedbackCard />
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
