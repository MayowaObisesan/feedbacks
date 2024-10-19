"use client";

import FeedbackCard from "@/components/FeedbackCard";
import HomeNav from "@/components/homeNav";
import { CameraIcon } from "@/components/icons/CameraIcon";
import { CreateProfileModal } from "@/components/profileModal";
import { TrendingBrandCard, TrendingCard } from "@/components/TrendingCard";
import {
  BRAND_ABI,
  BRAND_ADDRESS,
  BRAND_CATEGORIES,
  FEEDBACK_ADDRESS,
  FEEDBACKS_ABI,
} from "@/constant";
import { useFeedbacksContext } from "@/context";
import useContractEvent from "@/hooks/useContractEvent";
import useRead from "@/hooks/useRead";
import useWrite from "@/hooks/useWrite";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Checkbox } from "@nextui-org/checkbox";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
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
import { Select, SelectItem } from "@nextui-org/select";
import axios from "axios";
import {
  LucideCheckCheck,
  LucideLock,
  LucideMail,
  LucidePlus,
  LucideUpload,
  LucideX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useReadContract, useWriteContract } from "wagmi";

export const CreateBrandModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [brandName, setBrandName] = useState<string>("");
  const { profileExist } = useFeedbacksContext();
  const [categoryValues, setCategoryValues] = useState<any>(new Set([]));

  const [imageHash, setImageHash] = useState<string>("");
  const [imageUploadPending, setImageUploadPending] = useState<boolean>(false);
  const [imageUploadSuccessful, setImageUploadSuccessful] =
    useState<boolean>(false);

  // For dp upload state management
  const [dp, setDp] = useState<string>("");
  const [dpPreview, setDpPreview] = useState<string>("");
  const [isDpUploading, setisDpUploading] = useState<boolean>(false);
  const profileImageRef = useRef(null);
  const imageHashRef = useRef("");

  const onCreateBrand = () => {
    writeContract({
      abi: BRAND_ABI,
      address: BRAND_ADDRESS,
      functionName: "registerBrand",
      args: [brandName, Array.from(categoryValues).join(", "), imageHash],
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

  const sendFileToIPFS = async () => {
    console.log(dp, process.env.NEXT_PUBLIC_PINATA_JWT);
    if (dp) {
      try {
        const formData = new FormData();
        formData.append("file", dp);

        setisDpUploading(true);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            // pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
            // pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
        });

        const ImgHash = `https://moccasin-many-grasshopper-363.mypinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        imageHashRef.current = resFile?.data?.IpfsHash;
        setImageHash(resFile?.data?.IpfsHash);
        setImageUploadSuccessful(true);

        //Take a look at your Pinata Pinned section, you will see a new file added to you list.
        toast.success("Dp uploaded successfully");
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
        toast.error("Error uploading display picture");
        setImageUploadSuccessful(false);
      } finally {
        setisDpUploading(false);
        setImageUploadPending(false);
      }
    }
  };

  const handleTriggerDpChange = (event: any) => {
    const selectedImage = event.target.files[0];
    setDp(selectedImage);
    setDpPreview(URL.createObjectURL(selectedImage));
    setImageUploadPending(true);
  };

  const removeProfileUpload = () => {
    setDp("");
    setDpPreview("");
    setImageHash("");
    setImageUploadPending(false);
  };

  const handleClose = (categoryToRemove: string) => {
    setCategoryValues(
      Array.from(categoryValues).filter((it) => it !== categoryToRemove)
    );
    if (categoryValues.length === 1) {
      setCategoryValues(new Set([]));
    }
  };

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
        hideCloseButton={false}
        isDismissable={false}
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
                <div className="card items-center gap-y-4 shrink-0 my-4 w-full">
                  {imageUploadPending && (
                    <Chip
                      color="warning"
                      variant="flat"
                      radius="sm"
                      className="w-full text-sm"
                    >
                      You haven't uploaded the profile image
                    </Chip>
                  )}
                  <div className={"relative inline-block"}>
                    <Card>
                      <Image
                        width={360}
                        height={160}
                        alt=""
                        src={dpPreview}
                        className="object-cover"
                        isZoomed
                      />
                    </Card>
                    <div className="">
                      {dpPreview && (
                        <Avatar
                          size="lg"
                          src={dpPreview}
                          isBordered
                          color="success"
                          className="z-10 absolute -bottom-2 -left-2"
                        />
                      )}
                      {/* <div
                    className="w-32 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2"
                    ref={profileImageRef}
                  >
                    <Image
                      width={100}
                      height={100}
                      alt=""
                      src={
                        userData.profilePicture == ""
                          ? defaultImage
                          : userData.profilePicture
                      }
                      className="bg-base-300"
                    />
                  </div> */}
                    </div>
                    {dpPreview && (
                      <Button
                        isIconOnly
                        color="danger"
                        className={"absolute -top-2 -right-2 z-10 btn-error"}
                        radius="full"
                        onClick={removeProfileUpload}
                      >
                        <LucideX size={16} strokeWidth={4} />
                      </Button>
                    )}
                  </div>
                  {!dpPreview ? (
                    <Button
                      as={"label"}
                      htmlFor={"id-avatar-dp"}
                      title="Select dp"
                      className="mt-4"
                      startContent={<CameraIcon />}
                    >
                      {/* <LucideCamera /> */}
                      Select Brand Image
                      <Input
                        type="file"
                        name=""
                        id="id-avatar-dp"
                        className="hidden"
                        onChange={handleTriggerDpChange}
                        ref={profileImageRef}
                      />
                    </Button>
                  ) : (
                    <>
                      {!imageUploadSuccessful ? (
                        <Button
                          color="success"
                          onClick={sendFileToIPFS}
                          isLoading={isDpUploading}
                          className="mt-8 font-bold"
                          startContent={
                            !isDpUploading && (
                              <LucideUpload size={16} strokeWidth={4} />
                            )
                          }
                        >
                          {!isDpUploading ? "Upload Image" : ""}
                        </Button>
                      ) : (
                        <Button
                          color="success"
                          isLoading={isDpUploading}
                          className="mt-8 font-bold"
                          startContent={
                            <LucideCheckCheck size={16} strokeWidth={4} />
                          }
                          isDisabled
                        >
                          Image Uploaded
                        </Button>
                      )}
                    </>
                  )}
                </div>
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

                <Select
                  label="Category"
                  placeholder="Select a Brand category"
                  selectionMode="multiple"
                  className=""
                  selectedKeys={categoryValues}
                  onSelectionChange={setCategoryValues}
                >
                  {BRAND_CATEGORIES.map((eachBrandCategory, index) => (
                    <SelectItem key={eachBrandCategory}>
                      {eachBrandCategory}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex gap-2">
                  {Array.from(categoryValues as string).map(
                    (eachCategoryValue, index) => (
                      <Chip
                        key={index}
                        onClose={() => handleClose(eachCategoryValue)}
                        variant="flat"
                      >
                        {eachCategoryValue}
                      </Chip>
                    )
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button> */}
                <Button
                  color="primary"
                  onPress={onCreateBrand}
                  isLoading={isPending}
                  isDisabled={
                    brandName.length < 1 ||
                    (imageUploadPending && !imageUploadSuccessful)
                  }
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
