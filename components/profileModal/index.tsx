"use client";

import { FEEDBACK_ADDRESS, FEEDBACKS_ABI } from "@/constant";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { LucideMail, LucidePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";

export function CreateProfileModal({ buttonText = "Create Profile" }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const onCreateProfile = () => {
    writeContract({
      abi: FEEDBACKS_ABI,
      address: FEEDBACK_ADDRESS,
      functionName: "createProfile",
      args: [userName, email, bio, ""],
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
                Create Profile
              </ModalHeader>
              <ModalBody className="space-y-4">
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
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onCreateProfile}
                  isLoading={isPending}
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
