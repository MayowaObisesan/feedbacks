import { useFeedbacksContext } from "@/context";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { useWriteContract } from "wagmi";
import { useEffect, useRef, useState } from "react";
import { unkey } from "@/utils/unkey";
import { cleanBrandRawName } from "@/utils";
import { DBTables, E_BillingTier } from "@/types/enums";
import { supabase } from "@/utils/supabase/supabase";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@nextui-org/button";
import { LucideCheckCheck, LucidePlus, LucideUpload, LucideX } from "lucide-react";
import { Chip } from "@nextui-org/chip";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Avatar } from "@nextui-org/avatar";
import { CameraIcon } from "@/components/icons/CameraIcon";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { formatCategoryKey, getBrandCategoriesKey } from "@/constant";

export default function CreateBrandModal() {
  const { user } = useFeedbacksContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [brandName, setBrandName] = useState<string>("");
  const [brandDescription, setBrandDescription] = useState<string>("");
  const { profileExist } = useFeedbacksContext();
  const [categoryValues, setCategoryValues] = useState<any>(new Set([]));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

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

  const onCreateBrand = async () => {
    /*writeContract({
      abi: BRAND_ABI,
      address: BRAND_ADDRESS,
      functionName: "registerBrand",
      args: [brandName, Array.from(categoryValues).join(", "), imageHash]
    });*/

    setIsSubmitting(true);

    // Create an API for this brand
    const createdAPI = await unkey.apis.create({ name: cleanBrandRawName(brandName) });

    // Create an API key for this brand before inserting into the database
    const createdKey = await unkey.keys.create({
      apiId: createdAPI.result?.apiId!,
      prefix: "fdb",
      byteLength: 16,
      ownerId: user?.email,
      name: `${user?.user_metadata.userName}_key`,
      meta: {
        billingTier: E_BillingTier.FREE,
        trialEnds: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30).toISOString() // In 1 month
      },
      expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 30, // unix milliseconds timestamp of 1 month
      ratelimit: {
        type: "consistent",
        duration: 1000,
        limit: 10
      },
      remaining: 1000,
      refill: {
        interval: "monthly",
        amount: 1000,
        refillDay: 1
      },
      enabled: true
    });

    console.log(createdKey, categoryValues);

    try {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .insert([{
          ownerEmail: user?.email,
          name: cleanBrandRawName(brandName),
          rawName: brandName,
          description: brandDescription,
          category: Array.from(categoryValues).join(", "),
          followersCount: 0,
          feedbackCount: 0,
          brandImage: imageHash,
          api: createdAPI.result?.apiId,
          userApiKey: createdKey.result?.key,
          followers: []
        }])
        .select();

      if (data) {
        onClose();
        toast.success("Brand created successfully.");
      }

      if (error) {
        console.error("error creating brand", error);
        toast.error("Error creating brand. Kindly try again.");
      }
    } catch (error) {
      console.error("Unable to create brand", error)
    } finally {
      setIsSubmitting(false)
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
        body: formData
      });

      const data = await res.json();
      console.log("image uploaded data", data);
      setImageHash(data.secure_url);
      setImageUploadSuccessful(true);
      toast.success("Dp uploaded successfully");
    } catch (error) {
      console.log("Error uploading file: ");
      console.log(error);
      toast.error("Error uploading display picture");
      setImageUploadSuccessful(false);
    } finally {
      setisDpUploading(false);
      setImageUploadPending(false);
    }
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
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
          }
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
    setImageUploadSuccessful(false);
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
            "bg-gradient-to-t from-zinc-900 to-zinc-900/80 backdrop-opacity-90"
        }}
        hideCloseButton={false}
        isDismissable={false}
      >
        <ModalContent className="relative overflow-auto">
          {(onClose) => (
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
                Create Brand
              </ModalHeader>
              <ModalBody>
                {/*<CldImage
                  alt={"Brand Image to upload"}
                  src={dpPreview} // Use this sample image or upload your own via the Media Explorer
                  width="500" // Transform the image: auto-crop to square aspect_ratio
                  height="500"
                  crop={{
                    type: 'auto',
                    source: true
                  }}
                />*/}
                <div className="flex flex-col items-center gap-y-4 shrink-0 my-4 w-full">
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
                          onClick={handleImageUpload}
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
                <Textarea
                  label="Description"
                  placeholder={`Describe your brand`}
                  className=""
                  value={brandDescription}
                  onValueChange={setBrandDescription}
                  classNames={{
                    input: "placeholder:text-default-300"
                  }}
                />
                <Select
                  label="Category"
                  placeholder="Select a Brand category"
                  selectionMode="multiple"
                  className=""
                  selectedKeys={categoryValues}
                  onSelectionChange={setCategoryValues}
                >
                  {getBrandCategoriesKey().map((eachBrandCategory, index) => (
                    <SelectItem key={eachBrandCategory}>
                      {formatCategoryKey(eachBrandCategory)}
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
                  isLoading={isSubmitting}
                  isDisabled={
                    brandName.length < 1 ||
                    (imageUploadPending && !imageUploadSuccessful)
                  }
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
