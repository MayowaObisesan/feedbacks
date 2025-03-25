"use client";

import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { LucideReply } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
// import { useWriteContract } from "wagmi";
import { Divider } from "@heroui/divider";

import { useCreateOrUpdateFeedbackReplies } from "@/hooks/useFeedbacks";
import { Brand, Feedback } from "@/types";
import FeedbackCard from "@/components/FeedbackCard";

export function ReplyFeedbackModal({
  brandData,
  feedbackData,
}: {
  brandData: Brand;
  feedbackData: Feedback;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [isSubmitPending, setIsSubmitPending] = useState(false);
  const createOrUpdateFeedbackReply = useCreateOrUpdateFeedbackReplies();

  const onSubmitReply = async () => {
    setIsSubmitPending(true);

    try {
      // @ts-ignore
      const response = await createOrUpdateFeedbackReply.mutateAsync({
        brand_id: feedbackData.recipient_id,
        feedback_id: feedbackData.id,
        owner_email: brandData?.owner_email,
        reply: feedbackContent.trim(),
      });

      if (response) {
        onClose();
        toast.success("Reply sent.");
      }
    } catch (e) {
      toast.error("Error creating your reply. Kindly try again.");
    } finally {
      setIsSubmitPending(false);
    }
  };

  return (
    <>
      <Button
        className={"dark:invert"}
        color="default"
        radius={"md"}
        size={"sm"}
        startContent={<LucideReply size={16} strokeWidth={4} />}
        variant="solid"
        onPress={onOpen}
      >
        Reply
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          wrapper: "",
          base: "px-3 py-4 my-2",
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/80 backdrop-opacity-90",
        }}
        hideCloseButton={false}
        isDismissable={false}
        isOpen={isOpen}
        placement="auto"
        scrollBehavior={"normal"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-bold">
                Reply Feedback
              </ModalHeader>
              <ModalBody className="space-y-2">
                <FeedbackCard {...feedbackData} hideReplyButton={true} />

                <Divider />

                <Textarea
                  isRequired
                  className=""
                  classNames={{
                    input: "placeholder:text-default-300",
                  }}
                  // label="Reply Feedback"
                  // labelPlacement="outside"
                  placeholder={"Reply to this feedback"}
                  value={feedbackContent}
                  onValueChange={setFeedbackContent}
                />
              </ModalBody>
              <ModalFooter className={"flex flex-col"}>
                <Button
                  color="primary"
                  isDisabled={feedbackContent === ""}
                  isLoading={isSubmitPending}
                  onPress={onSubmitReply}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
