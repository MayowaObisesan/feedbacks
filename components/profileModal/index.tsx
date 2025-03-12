"use client";

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
  LucideUpload,
  LucideX,
} from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { toast } from "sonner";
// import { useWriteContract } from "wagmi";
import axios from "axios";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Chip } from "@nextui-org/chip";

import { CameraIcon } from "../icons/CameraIcon";

// import { BRAND_ABI, BRAND_ADDRESS } from "@/constant";
import { DBTables, E_ProfileAction } from "@/types/enums";
import { supabase } from "@/utils/supabase/supabase";
import { useFeedbacksContext } from "@/context";

export function CreateProfileModal({
  action = E_ProfileAction.update,
  buttonText = "Create Profile",
  trigger,
  buttonProps,
}: {
  action: E_ProfileAction;
  buttonText: string;
  trigger?: ReactNode;
  buttonProps?: any;
}) {
  const { user, userDB } = useFeedbacksContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  // const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [userName, setUserName] = useState<string>(
    user?.user_metadata.user_name,
  );
  // const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>(userDB?.bio!);
  const [imageHash, setImageHash] = useState<string>(
    user?.user_metadata.avatar_url,
  );
  const [imageUploadPending, setImageUploadPending] = useState<boolean>(false);
  const [imageUploadSuccessful, setImageUploadSuccessful] = useState<boolean>(
    userDB?.dp || user?.user_metadata.avatar_url,
  );

  // For dp upload state management
  const [dp, setDp] = useState<string>(
    userDB?.dp || user?.user_metadata.avatar_url,
  );
  const [dpPreview, setDpPreview] = useState<string>(
    userDB?.dp || user?.user_metadata.avatar_url,
  );
  const [isDpUploading, setisDpUploading] = useState<boolean>(false);
  const profileImageRef = useRef(null);
  const imageHashRef = useRef("");

  const [selected, setSelected] = useState("profileImage");
  const [isSubmitPending, setIsSubmitPending] = useState(false);

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

  const onCreateProfile = async () => {
    /*writeContract({
      abi: BRAND_ABI,
      address: BRAND_ADDRESS,
      functionName: "createProfile",
      args: [userName, email, bio, imageHash],
    });*/
  };

  const onUpdateProfile = async () => {
    setIsSubmitPending(true);
    try {
      const { data, error } = await supabase
        .from(DBTables.User)
        .update({ bio: bio, dp: imageHash })
        .eq("email", user?.email)
        .select();

      if (error) {
        // console.error("Unable to update your profile");
        toast.error("Unable to update profile", {
          richColors: true,
          duration: 4000,
        });
      }

      if (data) {
        toast.success("Profile updated successfully", {
          richColors: true,
          duration: 4000,
        });

        // close the profile modal
        onClose();
      }
    } catch (e: any) {
      toast.error("Error updating profile", e.message);
    } finally {
      setIsSubmitPending(false);
    }
  };

  /*useEffect(() => {
    if (isSuccess) {
      onClose();
      toast.success("Profile created successfully.");
    }

    if (isError) {
      toast.error("Unable to create Profile");
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

        // const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
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
    setImageUploadSuccessful(false);
  };

  const removeProfileUpload = () => {
    setDp("");
    setDpPreview("");
    setImageHash("");
    setImageUploadPending(false);
    setImageUploadSuccessful(false);
  };

  return (
    <>
      <Button
        color="success"
        variant="shadow"
        onPress={onOpen}
        // endContent={<LucideUserPlus2 size={16} strokeWidth={2} />}
        {...buttonProps}
      >
        {trigger ? trigger : buttonText}
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          base: "px-3 py-4 shadow-none",
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/95 backdrop-opacity-90",
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
                {action === E_ProfileAction.create
                  ? "Create Profile"
                  : "Update Profile"}
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Card fullWidth shadow={"none"}>
                  <CardBody className="p-4">
                    <Tabs
                      aria-label="Options"
                      classNames={{
                        tab: "hidden",
                      }}
                      selectedKey={selected}
                      variant="light"
                      // @ts-ignore
                      onSelectionChange={setSelected}
                    >
                      <Tab key="profileImage" title="Profile Picture">
                        <div className="flex flex-col items-center shrink-0 my-4 w-full">
                          <div className={"relative inline-block"}>
                            <Card fullWidth>
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
                                className={
                                  "absolute -top-2 -right-2 z-10 btn-error"
                                }
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
                              Select Profile Image
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
                                  onClick={handleImageUpload}
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
                                    <LucideCheckCheck
                                      size={16}
                                      strokeWidth={4}
                                    />
                                  }
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
                              className="w-full text-sm"
                              color="warning"
                              radius="sm"
                              variant="flat"
                            >
                              You haven&apos;t uploaded the profile image
                            </Chip>
                          )}
                          <Input
                            // isRequired
                            // autoFocus
                            disabled={!!user?.user_metadata}
                            label="Username"
                            placeholder="What is your username?"
                            readOnly={!!user?.user_metadata}
                            value={
                              user?.user_metadata.name ||
                              user?.user_metadata.user_name
                            }
                            variant="flat"
                            onValueChange={setUserName}
                          />
                          {/*<Input
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
                          />*/}
                          <Textarea
                            className=""
                            label="About you..."
                            placeholder="Tell the world something about yourself"
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
                      isDisabled={!userName && !bio}
                      isLoading={isSubmitPending}
                      onPress={
                        action === E_ProfileAction.create
                          ? onCreateProfile
                          : onUpdateProfile
                      }
                    >
                      {action === E_ProfileAction.create ? "Create" : "Update"}
                    </Button>
                  ) : (
                    <Button
                      isIconOnly
                      className="ml-auto"
                      onClick={() => setSelected("profileInfo")}
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
