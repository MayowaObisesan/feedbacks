"use client";

import {
  BRAND_ABI,
  BRAND_ADDRESS,
  FEEDBACK_ADDRESS,
  FEEDBACKS_ABI,
} from "@/constant";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  LucideCheckCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideMail,
  LucidePlus,
  LucideUpload,
  LucideX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import { CameraIcon } from "../icons/CameraIcon";
import axios from "axios";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Chip } from "@nextui-org/chip";

export function CreateProfileModal({ buttonText = "Create Profile" }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
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

  const [selected, setSelected] = useState("profileImage");

  const onCreateProfile = () => {
    writeContract({
      abi: BRAND_ABI,
      address: BRAND_ADDRESS,
      functionName: "createProfile",
      args: [userName, email, bio, imageHash],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      toast.success("Profile created successfully.");
    }

    if (isError) {
      toast.error("Unable to create Profile");
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

        // const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
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

  return (
    <>
      <Button
        onPress={onOpen}
        color="success"
        variant="shadow"
        startContent={<LucidePlus size={16} strokeWidth={4} />}
      >
        {buttonText}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
        backdrop="opaque"
        classNames={{
          base: "px-3 py-4 shadow-none",
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/95 backdrop-opacity-90",
        }}
        hideCloseButton={false}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Profile
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Card>
                  <CardBody className="p-4">
                    <Tabs
                      aria-label="Options"
                      selectedKey={selected}
                      onSelectionChange={setSelected}
                      variant="light"
                      classNames={{
                        tab: "hidden",
                      }}
                    >
                      <Tab key="profileImage" title="Profile Picture">
                        <div className="card items-center shrink-0 my-4 w-full">
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
                                className={
                                  "absolute -top-2 -right-2 z-10 btn-error"
                                }
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
                              Select Product Image
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
                                    <LucideCheckCheck
                                      size={16}
                                      strokeWidth={4}
                                    />
                                  }
                                  isDisabled
                                >
                                  Image Uploaded
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </Tab>
                      <Tab key="profileInfo" title="ProfileDetails">
                        <div className="flex flex-col items-center gap-y-4">
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
                          <Input
                            isRequired
                            autoFocus
                            label="Username"
                            placeholder="What is your username?"
                            variant="flat"
                            value={userName}
                            onValueChange={setUserName}
                          />
                          <Input
                            isClearable
                            type="email"
                            label="Email"
                            variant="flat"
                            placeholder="Enter your email"
                            value={email}
                            onValueChange={setEmail}
                            endContent={<LucideMail />}
                            description={
                              "Your email is optional and we will never share your email"
                            }
                          />
                          <Textarea
                            label="About you..."
                            placeholder="Tell the world something about yourself"
                            className=""
                            value={bio}
                            onValueChange={setBio}
                          />
                        </div>
                      </Tab>
                    </Tabs>
                  </CardBody>
                </Card>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row justify-between items-start w-full">
                  {selected === "profileInfo" && (
                    <Button
                      isIconOnly
                      onClick={() => setSelected("profileImage")}
                    >
                      {<LucideChevronLeft size={16} strokeWidth={4} />}
                    </Button>
                  )}

                  {selected === "profileInfo" ? (
                    <Button
                      color="primary"
                      onPress={onCreateProfile}
                      isLoading={isPending}
                      isDisabled={!userName && !bio}
                    >
                      {isPending ? "Creating..." : "Create"}
                    </Button>
                  ) : (
                    <Button
                      isIconOnly
                      onClick={() => setSelected("profileInfo")}
                      className="ml-auto"
                    >
                      {<LucideChevronRight size={16} strokeWidth={4} />}
                    </Button>
                  )}
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
