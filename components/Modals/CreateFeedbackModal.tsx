"use client";

import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { LucideFileImage, LucidePlus, LucideX } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
// import { useWriteContract } from "wagmi";
import { cn } from "@heroui/theme";
import { Switch } from "@heroui/switch";
import { Divider } from "@heroui/divider";
import { Card } from "@heroui/card";
import { Image } from "@heroui/image";

import RatingComponent from "../RatingStars/RatingComponent";

import { RatingTag } from "@/utils";
import { useCreateFeedback } from "@/hooks/useFeedbacks";
import { useUserAndUserDBQuery } from "@/hooks/useFeedbackUser";

const feedbackSampleList = [
  "The course content was well-structured, and the instructor clearly had a deep understanding of Rust. I loved how practical examples were integrated throughout, which made the learning process smoother!",
  "The course covered all the key areas I was hoping for, but I felt that the pacing was a bit fast, especially during the concurrency section. It would be great to have a few more detailed breakdowns of complex topics.",
  "Great job overall! However, I think adding more quizzes or hands-on projects at the end of each module would really help solidify the knowledge and give students more confidence in applying what they've learned.",
  "The tutorial videos were clear and engaging. One suggestion would be to include more real-world case studies to show how Rust is used in production-level applications.",
  "The project was a good proof of concept. However, I noticed some inconsistencies in the documentation and code comments. Clarifying these areas could help future collaborators understand the project better.",
  "The design of the project is sleek and functional, but I believe it could be optimized for performance. Consider running some benchmarks or profiling the code to see where improvements can be made.",
  "Fantastic job on meeting the requirements! The code quality is excellent, and your attention to detail really shows. Adding some unit tests would take this project to the next level.",
  "The final product turned out great, and I was impressed by the innovative features you added. However, I think you could improve error handling in edge cases to make it even more robust.",
  "The new update has brought a lot of improvements! The user interface is smoother, and the features are more intuitive. However, I did experience a few crashes during use, so it might be worth investigating potential stability issues.",
  "This product has been a game-changer for me! It's easy to use and packed with features. My only suggestion would be to add more customization options for advanced users who want to tweak settings further.",
  "The product's functionality is top-notch, and I appreciate how seamlessly it integrates with my existing setup. That said, the customer support response times could be faster.",
  "I'm really happy with the product overall. It works exactly as described, and the installation was a breeze. One minor improvement could be offering a more detailed user manual for those less tech-savvy.",
  "The team worked well together and met the project deadline, which was fantastic. However, there were times when task ownership was unclear. Establishing clear roles upfront could help avoid confusion in the future.",
  "Great job on delivering such high-quality work under tight deadlines. One suggestion for improvement would be to schedule more regular check-ins to ensure everyone stays on track and issues can be addressed early.",
  "The collaboration between the different team members was impressive. I appreciated how everyone was proactive in solving problems. If we could document the decisions made during meetings, it would help keep track of progress more effectively.",
  "I'm really pleased with how the team handled the project. The communication was strong, and everyone contributed valuable insights. A small area for improvement would be speeding up response times on certain critical tasks.",
];

function getRandomFeedback(feedbackList: string[]) {
  const randomIndex = Math.floor(Math.random() * feedbackList.length);

  return feedbackList[randomIndex];
}

export function CreateFeedbackModal({
  brandId,
  buttonText = "Create Feedback",
  fullWidth = false,
}: {
  brandId: number | null;
  buttonText?: string;
  fullWidth?: boolean;
}) {
  const { data: userAndUserDB } = useUserAndUserDBQuery();

  const { user } = userAndUserDB || {};
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  // const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [feedbackTitle, setFeedbackTitle] = useState<string>("");
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [rating, setRating] = useState<number | null>(2);
  const [isSubmitPending, setIsSubmitPending] = useState(false);
  const [beAnonymous, setBeAnonymous] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const memoizedPlaceholder = useMemo(
    () => getRandomFeedback(feedbackSampleList),
    [],
  );
  const createFeedback = useCreateFeedback();

  const onCreateFeedback = async () => {
    /*writeContract({
      abi: FEEDBACKS_ABI,
      address: FEEDBACK_ADDRESS,
      functionName: "submitFeedback",
      args: [brandId, feedbackContent, 0, 0, rating], // 0, 0 because I am just creating this feedback for a brand and not for a product nor event
    });*/

    setIsSubmitPending(true);

    const uploadScreenshots = async (files: File[]) => {
      try {
        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();

          formData.append("file", file);
          formData.append("upload_preset", "feedbacks_preset");

          try {
            const res = await fetch(
              process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!,
              {
                method: "POST",
                body: formData,
              },
            );

            if (!res.ok) {
              throw new Error(`Failed to upload ${file.name}`);
            }

            const data = await res.json();

            return data.secure_url;
          } catch (error) {
            toast.error(
              `Error uploading ${file.name}: ${(error as any).message}`,
            );
            throw error;
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        toast.success("Screenshots uploaded successfully");

        return uploadedUrls;
      } catch (error) {
        toast.error("Error uploading screenshots");
        throw error;
      }
    };

    try {
      const screenshotUrls =
        selectedImages.length > 0
          ? await uploadScreenshots(selectedImages)
          : [];

      // @ts-ignore
      const response = await createFeedback.mutateAsync({
        recipientId: brandId!,
        title: feedbackTitle.trim(),
        email: user?.email!,
        description: feedbackContent.trim(),
        eventId: null,
        productId: null,
        starRating: rating,
        beAnonymous: beAnonymous,
        screenshots: screenshotUrls.join(","),
      });

      console.log("create feedback response", response);

      if (response) {
        onClose();
        toast.success("Feedback created successfully.");
      }

      /*const { data, error } = await supabase
        .from(DBTables.Feedback)
        .insert([
          {
            recipientId: brandId,
            title: feedbackTitle,
            email: user?.email,
            description: feedbackContent,
            eventId: null,
            productId: null,
            starRating: rating,
            beAnonymous: beAnonymous,
            screenshots:
              selectedImages.length > 0 ? selectedImages.join(",") : "",
          },
        ])
        .select();

      const { count } = await supabase
        .from(DBTables.Feedback)
        .select("*", { count: "exact", head: true })
        .eq("recipientId", brandId);

      // Update the brands parameters also.
      if (count! > 0) {
        await supabase
          .from(DBTables.Brand)
          .update({
            feedbackCount: count,
          })
          .eq("id", brandId);
      }

      if (data) {
        onClose();
        toast.success("Feedback created successfully.");
      }

      if (error) {
        // console.error("error creating feedback", error);
        toast.error("Error creating your feedback. Kindly try again.");
      }*/
    } catch (e) {
      toast.error("Error creating your feedback. Kindly try again.");
    } finally {
      setIsSubmitPending(false);
    }
  };

  const handleAddScreenshots = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";

    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);

      // Check number of files
      if (files.length + selectedImages.length > 2) {
        toast.error("Maximum 2 images allowed");

        return;
      }

      // Validate each file
      const validFiles = files.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit`);

          return false;
        }
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);

          return false;
        }

        return true;
      });

      // Create preview URLs and update state
      validFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });

      setSelectedImages((prev) => [...prev, ...validFiles]);
    };

    input.click();
  };

  /*useEffect(() => {
    if (isSuccess) {
      onClose();
      toast.success("Feedback created successfully.");
    }

    if (isError) {
      toast.error("Unable to create Feedback");
    }
  }, [isSuccess, isError]);*/

  return (
    <>
      <Button
        className={"invert"}
        color="default"
        fullWidth={fullWidth}
        isDisabled={!user?.email}
        startContent={<LucidePlus size={16} strokeWidth={4} />}
        variant="solid"
        onPress={onOpen}
      >
        {buttonText}
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          wrapper: "",
          base: "px-3 py-4 my-2 max-sm:w-full max-sm:h-full",
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/80 backdrop-opacity-90",
        }}
        hideCloseButton={false}
        isDismissable={false}
        isOpen={isOpen}
        placement="auto"
        scrollBehavior={"outside"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold">
                Submit Feedback
              </ModalHeader>
              <ModalBody className="space-y-2">
                <Card isPressable className={cn("bg-default-100")}>
                  <Switch
                    classNames={{
                      base: cn(
                        "inline-flex flex-row-reverse w-full max-w-md items-center",
                        "justify-between cursor-pointer rounded-2xl gap-4 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-warning",
                      ),
                      wrapper: cn(
                        "p-0 h-4 overflow-visible",
                        // selected
                        "group-data-[selected=true]:bg-warning",
                      ),
                      thumb: cn(
                        "w-6 h-6 border-2 shadow-lg",
                        "group-data-[hover=true]:border-warning",
                        //selected
                        "group-data-[selected=true]:ms-6",
                        // pressed
                        "group-data-[pressed=true]:w-7",
                        "group-data-[selected]:group-data-[pressed]:ms-4",
                      ),
                    }}
                    isSelected={beAnonymous}
                    onValueChange={setBeAnonymous}
                  >
                    <div className="flex flex-col gap-1 text-left">
                      <p className="text-small">Send Feedback as Anonymous</p>
                      <p className="text-small text-default-400">
                        Your name will not be shown when you send this feedback.
                      </p>
                    </div>
                  </Switch>
                </Card>

                <Divider />

                <div>
                  <Input
                    label="Title"
                    labelPlacement="outside"
                    placeholder="A title for your feedback"
                    size={"md"}
                    value={feedbackTitle}
                    onValueChange={setFeedbackTitle}
                  />
                </div>
                <Textarea
                  isRequired
                  className=""
                  classNames={{
                    input: "placeholder:text-default-300",
                  }}
                  label="Your Feedback"
                  labelPlacement="outside"
                  placeholder={`e.g., ${memoizedPlaceholder}`}
                  value={feedbackContent}
                  onValueChange={setFeedbackContent}
                />
                <div className="space-y-2">
                  <div className="text-small">Set a Rating</div>
                  {/* <Rating setRating={setRating} /> */}
                  <RatingComponent
                    selectedRating={rating!}
                    setSelectedRating={setRating}
                  />
                </div>
                {rating! > 0 ? (
                  <div className="font-bold text-warning">
                    {RatingTag(rating!)}
                  </div>
                ) : (
                  <div>No rating selected</div>
                )}
              </ModalBody>
              <ModalFooter className={"flex flex-col px-0"}>
                <div className={""}>
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-3 px-4 py-2 overflow-x-auto">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative w-16 h-16 ">
                          <Image
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            height={"64px"}
                            src={preview}
                            width={"64px"}
                          />
                          <Button
                            isIconOnly
                            className="absolute -top-2 -right-2 z-10 bg-danger-500 text-white rounded-full flex items-center justify-center"
                            size={"sm"}
                            onPress={() => {
                              setImagePreviews((prev) =>
                                prev.filter((_, i) => i !== index),
                              );
                              setSelectedImages((prev) =>
                                prev.filter((_, i) => i !== index),
                              );
                            }}
                          >
                            <LucideX size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {imagePreviews.length > 0 && <Divider className={"my-2"} />}
                </div>
                <div
                  className={
                    "flex flex-row justify-between items-center w-full"
                  }
                >
                  <Button
                    isDisabled={imagePreviews.length === 2}
                    variant={"flat"}
                    onPress={handleAddScreenshots}
                  >
                    <span className={"flex flex-row gap-x-2 text-small"}>
                      <LucideFileImage size={20} />
                      Add Screenshots
                    </span>
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={feedbackContent === ""}
                    isLoading={isSubmitPending}
                    onPress={onCreateFeedback}
                  >
                    Submit
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
