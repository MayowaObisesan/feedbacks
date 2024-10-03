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
import { LucidePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";

export function CreateProductModal({
  brandId,
  buttonText = "Create Product",
}: {
  brandId: number | null;
  buttonText?: string;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const onCreateProduct = () => {
    writeContract({
      abi: FEEDBACKS_ABI,
      address: FEEDBACK_ADDRESS,
      functionName: "createProduct",
      args: [productName, description, brandId],
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
                Create Product
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  isRequired
                  autoFocus
                  label="Username"
                  placeholder="e.g., Samsung S25"
                  variant="flat"
                  value={productName}
                  onValueChange={setProductName}
                />
                <Textarea
                  label="Description"
                  placeholder="The latest flagship of the Samsung Galaxy lineups"
                  className=""
                  value={description}
                  onValueChange={setDescription}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onCreateProduct}
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
