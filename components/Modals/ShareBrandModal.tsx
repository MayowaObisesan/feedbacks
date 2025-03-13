import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { LucideShare2 } from "lucide-react";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const currentUrl = window.location.href;

  const shareButtons = [
    {
      name: "Twitter",
      icon: "lucide:twitter",
      color: "bg-[#1DA1F2]",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "Facebook",
      icon: "lucide:facebook",
      color: "bg-[#4267B2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "Instagram",
      icon: "lucide:instagram",
      color: "bg-[#E4405F]",
      href: `https://www.instagram.com/share?url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "TikTok",
      icon: "fa6-solid:tiktok",
      color: "bg-[#000000]",
      href: `https://www.tiktok.com/share?url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: "lucide:linkedin",
      color: "bg-[#0A66C2]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="">
      <Button
        isIconOnly
        color="primary"
        startContent={<LucideShare2 />}
        onPress={onOpen}
      />

      <Modal isOpen={isOpen} size="lg" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Share this page
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center gap-6">
                  <div className="bg-white p-4 rounded-xl">
                    <QRCodeSVG
                      includeMargin={true}
                      level="H"
                      size={200}
                      value={currentUrl}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                    {shareButtons.map((button) => (
                      <Button
                        key={button.name}
                        className={`${button.color} text-white w-full`}
                        onPress={() => handleShare(button.href)}
                      >
                        {button.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
