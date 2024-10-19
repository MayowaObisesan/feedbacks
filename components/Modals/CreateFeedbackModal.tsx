"use client";

import { FEEDBACK_ADDRESS, FEEDBACKS_ABI } from "@/constant";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { LucidePlus } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import Rating from "../RatingStars/Rating";
import RatingComponent from "../RatingStars/RatingComponent";
import { RatingTag } from "@/utils";

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
}: {
  brandId: number | null;
  buttonText?: string;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [rating, setRating] = useState<number>(2);

  const onCreateProduct = () => {
    writeContract({
      abi: FEEDBACKS_ABI,
      address: FEEDBACK_ADDRESS,
      functionName: "submitFeedback",
      args: [brandId, feedbackContent, 0, 0, rating], // 0, 0 because I am just creating this feedback for a brand and not for a product nor event
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      toast.success("Feedback created successfully.");
    }

    if (isError) {
      toast.error("Unable to create Feedback");
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
        {buttonText}
      </Button>
      <Modal
        isOpen={isOpen}
        isDismissable={false}
        onOpenChange={onOpenChange}
        placement="auto"
        backdrop="opaque"
        classNames={{
          base: "px-3 py-4",
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/80 backdrop-opacity-90",
        }}
        hideCloseButton={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Submit Feedback
              </ModalHeader>
              <ModalBody className="space-y-2">
                <Textarea
                  isRequired
                  label="Your Feedback"
                  labelPlacement="outside"
                  placeholder={`e.g., ${getRandomFeedback(feedbackSampleList)}`}
                  className=""
                  value={feedbackContent}
                  onValueChange={setFeedbackContent}
                  classNames={{
                    input: "placeholder:text-default-300",
                  }}
                />
                <div className="space-y-2">
                  <div className="text-small">Set a Rating</div>
                  {/* <Rating setRating={setRating} /> */}
                  <RatingComponent
                    selectedRating={rating}
                    setSelectedRating={setRating}
                  />
                </div>
                {rating > 0 ? (
                  <div className="font-bold text-warning">
                    {RatingTag(rating)}
                  </div>
                ) : (
                  <div>No rating selected</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onCreateProduct}
                  isLoading={isPending}
                  isDisabled={feedbackContent === ""}
                >
                  {isPending ? "Submit..." : "Submit"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
