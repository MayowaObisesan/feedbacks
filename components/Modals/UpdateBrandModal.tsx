"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import axios from "axios";
import {
  LucideCheckCheck,
  LucidePlus,
  LucideUpload,
  LucideX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
// import { useWriteContract } from "wagmi";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import { CameraIcon } from "../icons/CameraIcon";

// import { useFeedbacksContext } from "@/context";
import { BRAND_CATEGORIES } from "@/constant";
import { cleanBrandRawName } from "@/utils";
import { useBrandById, useUpdateBrand } from "@/hooks/useBrands";

const UpdateBrandModal = ({
  brandId,
  fullWidth = false,
}: {
  brandId: number | null;
  fullWidth?: boolean;
}) => {
  // const [brandData, setBrandData] = useState<IBrands | null>(null);
  const { data: brandData } = useBrandById(brandId!);
  const updateBrand = useUpdateBrand();

  /*useEffect(() => {
    const _getBrand = async () => {
      const { data, error } = await BrandService.getBrandById(brandId!);

      if (data && data.length > 0) {
        setBrandData(data[0]);
      }

      if (error) {
        // console.error("Error fetching brand data", error);
      }
    };

    if (brandId !== null) _getBrand();
  }, [brandId]);*/

  /*const { data: _brandData, isFetching: isBrandDataFetching } = useBrandRead({
    functionName: "getBrand",
    args: [brandId],
  });
  const brandData: IBrands = _brandData as IBrands;*/

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [brandName, setBrandName] = useState<string>(brandData?.name!);
  const [brandDescription, setBrandDescription] = useState<string>(
    brandData?.description!,
  );
  // const { profileExist } = useFeedbacksContext();
  const [categoryValues, setCategoryValues] = useState<any>(
    brandData ? brandData?.category?.split(",") : new Set([]),
  );

  const [imageHash, setImageHash] = useState<string>(brandData?.brand_image!);
  const [imageUploadPending, setImageUploadPending] = useState<boolean>(false);
  const [imageUploadSuccessful, setImageUploadSuccessful] =
    useState<boolean>(false);

  // For dp upload state management
  const [dp, setDp] = useState<string>(brandData?.brand_image!);
  const [dpPreview, setDpPreview] = useState<string>(brandData?.brand_image!);
  const [isDpUploading, setisDpUploading] = useState<boolean>(false);
  const profileImageRef = useRef(null);
  const imageHashRef = useRef("");
  const [isSubmitPending, setIsSubmitPending] = useState(false);

  useEffect(() => {
    setBrandName(brandData?.raw_name!);
    setCategoryValues(brandData?.category?.split(","));
    setDp(brandData?.brand_image!);
    setDpPreview(brandData?.brand_image!);
  }, [brandData]);

  const onUpdateBrand = async () => {
    /*writeContract({
      abi: BRAND_ABI,
      address: BRAND_ADDRESS,
      functionName: "updateBrand",
      args: [
        brandData?.brandId,
        brandName,
        Array.from(categoryValues).join(", "),
        imageHash,
      ],
    });*/

    setIsSubmitPending(true);

    try {
      await updateBrand.mutateAsync({
        id: brandId!,
        name: cleanBrandRawName(brandName),
        raw_name: brandName,
        description: brandDescription,
        category: Array.from(categoryValues).join(", "),
        brand_image: imageHash,
      });

      /*const { data, error } = await supabase.from(DBTables.Brand).update([
        {
          name: cleanBrandRawName(brandName),
          rawName: brandName,
          description: brandDescription,
          category: Array.from(categoryValues).join(", "),
          brandImage: imageHash,
        },
      ]);
      // .select();

      if (data) {
        onClose();
        toast.success("Brand updated successfully.");
      }

      if (error) {
        // console.error("error creating brand", error);
        toast.error("Error updating brand. Kindly try again.");
      }*/

      toast.success("Brand updated successfully.");
    } catch (e) {
      toast.error("Error updating brand. Kindly try again.");
    } finally {
      setIsSubmitPending(false);
    }
  };

  const handleImageUpload = async () => {
    if (!dp) return;

    try {
      const formData = new FormData();

      formData.append("file", dp);
      formData.append("upload_preset", "feedbacks_preset");

      const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // console.log("image uploaded data", data);
      setImageHash(data.secure_url);
      setImageUploadSuccessful(true);
      toast.success("Dp uploaded successfully");
    } catch (error) {
      // console.log("Error uploading file: ");
      // console.log(error);
      toast.error("Error uploading display picture");
      setImageUploadSuccessful(false);
    } finally {
      setisDpUploading(false);
      setImageUploadPending(false);
    }
  };

  /*useEffect(() => {
    if (isSuccess) {
      onClose();
      toast.success("Brand Updated successfully.");
    }

    if (isError) {
      toast.error("Unable to Update Brand");
    }
  }, [isSuccess, isError]);*/

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendFileToIPFS = async () => {
    // console.log(dp, process.env.NEXT_PUBLIC_PINATA_JWT);
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

        // const ImgHash = `https://moccasin-many-grasshopper-363.mypinata.cloud/ipfs/${resFile.data.IpfsHash}`;

        // console.log(ImgHash);
        imageHashRef.current = resFile?.data?.IpfsHash;
        setImageHash(resFile?.data?.IpfsHash);
        setImageUploadSuccessful(true);

        //Take a look at your Pinata Pinned section, you will see a new file added to you list.
        toast.success("Dp uploaded successfully");
      } catch (error) {
        // console.log("Error sending File to IPFS: ");
        // console.log(error);
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
      Array.from(categoryValues).filter((it) => it !== categoryToRemove),
    );
    if (categoryValues.length === 1) {
      setCategoryValues(new Set([]));
    }
  };

  return (
    <>
      <Button
        className={"invert"}
        color="default"
        fullWidth={fullWidth}
        startContent={<LucidePlus size={16} strokeWidth={4} />}
        variant="solid"
        onPress={onOpen}
      >
        Update Brand
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          wrapper: "",
          base: "relative px-3 py-4",
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/80 backdrop-opacity-90",
        }}
        hideCloseButton={false}
        isDismissable={false}
        isOpen={isOpen}
        placement="auto"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="relative overflow-auto">
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {() => (
            <>
              {/*{!profileExist && (
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
              )}*/}
              <ModalHeader className="flex flex-col gap-1">
                Update Brand
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center gap-y-4 shrink-0 my-4 w-full">
                  {imageUploadPending && (
                    <Chip
                      className="w-full text-sm"
                      color="warning"
                      radius="sm"
                      variant="flat"
                    >
                      You haven&apos;t uploaded the profile image
                    </Chip>
                  )}
                  <div className={"relative inline-block"}>
                    <Card>
                      <Image
                        isZoomed
                        alt=""
                        className="object-cover"
                        height={160}
                        src={dpPreview}
                        width={360}
                      />
                    </Card>
                    <div className="">
                      {dpPreview && (
                        <Avatar
                          isBordered
                          className="z-10 absolute -bottom-2 -left-2"
                          color="success"
                          size="lg"
                          src={dpPreview}
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
                        className={"absolute -top-2 -right-2 z-10 btn-error"}
                        color="danger"
                        radius="full"
                        onPress={removeProfileUpload}
                      >
                        <LucideX size={16} strokeWidth={4} />
                      </Button>
                    )}
                  </div>
                  {!dpPreview ? (
                    <Button
                      as={"label"}
                      className="mt-4"
                      htmlFor={"id-avatar-dp"}
                      startContent={<CameraIcon />}
                      title="Select dp"
                    >
                      {/* <LucideCamera /> */}
                      Select Product Image
                      <Input
                        ref={profileImageRef}
                        className="hidden"
                        id="id-avatar-dp"
                        name=""
                        type="file"
                        onChange={handleTriggerDpChange}
                      />
                    </Button>
                  ) : (
                    <>
                      {!imageUploadSuccessful ? (
                        <Button
                          className="mt-8 font-bold"
                          color="success"
                          isLoading={isDpUploading}
                          startContent={
                            !isDpUploading && (
                              <LucideUpload size={16} strokeWidth={4} />
                            )
                          }
                          onPress={handleImageUpload}
                        >
                          {!isDpUploading ? "Upload Image" : ""}
                        </Button>
                      ) : (
                        <Button
                          isDisabled
                          className="mt-8 font-bold"
                          color="success"
                          isLoading={isDpUploading}
                          startContent={
                            <LucideCheckCheck size={16} strokeWidth={4} />
                          }
                        >
                          Image Uploaded
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <Input
                  // autoFocus
                  isClearable
                  isRequired
                  defaultValue={brandData?.raw_name}
                  label="Name"
                  placeholder="Update your brand name"
                  value={brandName}
                  variant="flat"
                  onValueChange={setBrandName}
                />
                <Textarea
                  className=""
                  classNames={{
                    input: "placeholder:text-default-300",
                  }}
                  defaultValue={brandData?.description!}
                  label="Description"
                  placeholder={`Describe your brand`}
                  onValueChange={setBrandDescription}
                />
                <Select
                  className=""
                  label="Category"
                  placeholder="Select a Brand category"
                  selectedKeys={categoryValues}
                  selectionMode="multiple"
                  onSelectionChange={setCategoryValues}
                >
                  {BRAND_CATEGORIES.map((eachBrandCategory) => (
                    <SelectItem key={eachBrandCategory}>
                      {eachBrandCategory}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex gap-2">
                  {categoryValues &&
                    Array.from(categoryValues as string).map(
                      (eachCategoryValue, index) => (
                        <Chip
                          key={index}
                          variant="flat"
                          onClose={() => handleClose(eachCategoryValue)}
                        >
                          {eachCategoryValue}
                        </Chip>
                      ),
                    )}
                </div>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button> */}
                <Button
                  color="primary"
                  isDisabled={
                    brandName?.length < 1 ||
                    (categoryValues &&
                      Array.from(categoryValues)?.length < 1) ||
                    (imageUploadPending && !imageUploadSuccessful)
                  }
                  isLoading={isSubmitPending}
                  onPress={onUpdateBrand}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateBrandModal;
