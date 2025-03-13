"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Image } from "@heroui/image";
import { Input, Textarea } from "@heroui/input";
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
import { useWriteContract } from "wagmi";
import { Chip } from "@heroui/chip";

import { CameraIcon } from "../icons/CameraIcon";

// import { useFeedbacksContext } from "@/context";
import { PRODUCT_ABI, PRODUCT_ADDRESS } from "@/constant";

export function CreateProductModal({
  brandId,
  buttonText = "Create Product",
}: {
  brandId: number | null;
  buttonText?: string;
}) {
  // const { myProfileData } = useFeedbacksContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  // const [fileImg, setFileImg] = useState(null);

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

  const onCreateProduct = () => {
    writeContract({
      abi: PRODUCT_ABI,
      address: PRODUCT_ADDRESS,
      functionName: "createProduct",
      args: [productName, description, brandId, imageHash],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      toast.success("Product created successfully.");
    }

    if (isError) {
      toast.error("Unable to create Product");
    }
  }, [isSuccess, isError]);

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

  return (
    <>
      <Button
        color="success"
        startContent={<LucidePlus size={16} strokeWidth={4} />}
        variant="shadow"
        onPress={onOpen}
      >
        {buttonText}
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          base: "px-3 py-4",
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/80 backdrop-opacity-90",
        }}
        hideCloseButton={false}
        isDismissable={false}
        isOpen={isOpen}
        placement="auto"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Product
              </ModalHeader>
              <ModalBody className="space-y-4">
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
                        onClick={removeProfileUpload}
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
                          onClick={sendFileToIPFS}
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
                  isRequired
                  label="Username"
                  placeholder="e.g., Samsung S25"
                  value={productName}
                  variant="flat"
                  onValueChange={setProductName}
                />
                <Textarea
                  className=""
                  label="Description"
                  placeholder="The latest flagship of the Samsung Galaxy lineups"
                  value={description}
                  onValueChange={setDescription}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  isLoading={isPending}
                  onPress={onCreateProduct}
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
}
