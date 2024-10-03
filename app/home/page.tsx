"use client";

import FeedbackCard from "@/components/FeedbackCard";
import HomeNav from "@/components/homeNav";
import { CreateProfileModal } from "@/components/profileModal";
import { TrendingBrandCard, TrendingCard } from "@/components/TrendingCard";
import { FEEDBACK_ADDRESS, FEEDBACKS_ABI } from "@/constant";
import { useFeedbacksContext } from "@/context";
import useContractEvent from "@/hooks/useContractEvent";
import useRead from "@/hooks/useRead";
import useWrite from "@/hooks/useWrite";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Checkbox } from "@nextui-org/checkbox";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { LucideLock, LucideMail, LucidePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useReadContract, useWriteContract } from "wagmi";

export const CreateBrandModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [brandName, setBrandName] = useState<string>("");
  const { profileExist } = useFeedbacksContext();

  const onCreateBrand = () => {
    writeContract({
      abi: FEEDBACKS_ABI,
      address: FEEDBACK_ADDRESS,
      functionName: "registerBrand",
      args: [brandName],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      toast.success("Brand created successfully.");
    }

    if (isError) {
      toast.error("Unable to create Brand");
    }
  }, [isSuccess, isError]);

  return (
    <>
      <Button
        onPress={onOpen}
        color="success"
        variant="shadow"
        startContent={<LucidePlus size={16} strokeWidth={4} />}
      >
        Create Brand
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
        backdrop="opaque"
        classNames={{
          wrapper: "",
          base: "relative px-3 py-4",
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/80 backdrop-opacity-90",
        }}
        hideCloseButton={true}
      >
        <ModalContent className="relative overflow-auto">
          {(onClose) => (
            <>
              {!profileExist && (
                <>
                  <Card className="inline-flex">
                    <CardBody>
                      <div className="flex flex-row justify-around items-center gap-x-4 text-center">
                        <span>Kindly set your name first.</span>
                        <CreateProfileModal buttonText="Add username" />
                      </div>
                    </CardBody>
                  </Card>
                </>
              )}
              <ModalHeader className="flex flex-col gap-1">
                Create Brand
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  isClearable
                  autoFocus
                  label="Name"
                  placeholder="Enter your brand name"
                  variant="flat"
                  value={brandName}
                  onValueChange={setBrandName}
                />
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button> */}
                <Button
                  color="primary"
                  onPress={onCreateBrand}
                  isLoading={isPending}
                  isDisabled={brandName.length < 1}
                >
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const AllBrands = ({ _name = "", _owner = "" }) => {
  const { data, isLoading, isFetched, isSuccess, isPlaceholderData } =
    useReadContract({
      abi: FEEDBACKS_ABI,
      address: FEEDBACK_ADDRESS,
      functionName: "getAllBrands",
      args: [_name, _owner],
    });

  return { data, isLoading, isFetched, isSuccess, isPlaceholderData };
};

export default function Home() {
  // useEffect(() => {
  //   const { data, isLoading } = AllBrands({});
  //   console.log(data, isLoading);
  // }, []);
  const { allBrandsData, profileExist } = useFeedbacksContext();
  useContractEvent({ eventName: "BrandRegistered" });

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
      <section className="h-full">
        <HomeNav />
      </section>
      <section className="space-y-8 px-8 lg:overflow-y-hidden">
        <div>
          <CreateBrandModal />
        </div>
        {!profileExist && (
          <Card className="inline-flex">
            <CardBody>
              <div className="flex flex-row items-center gap-x-4 text-center">
                <span>Set your username for your account.</span>
                <CreateProfileModal buttonText="Add username" />
              </div>
            </CardBody>
          </Card>
        )}
        <section>
          <header className="font-bold text-6xl leading-normal">
            Trending Brands
          </header>
          {allBrandsData?.length > 0 ? (
            <div className="flex flex-row gap-x-8 px-2 py-4 overflow-x-auto">
              {allBrandsData?.map((eachTrendingBrand) => (
                <TrendingBrandCard
                  key={eachTrendingBrand.name}
                  name={eachTrendingBrand.name}
                  rawName={eachTrendingBrand.rawName}
                  feedbackCount={Number(eachTrendingBrand.feedbackCount)}
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
          <header className="font-bold text-4xl leading-normal">
            Trending Feedbacks
          </header>
          <div className="flex flex-row flex-nowrap gap-x-8 px-2 py-4 overflow-x-auto">
            {trendingBrands.map((eachTrendingBrand) => (
              <FeedbackCard key={eachTrendingBrand.name} />
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
