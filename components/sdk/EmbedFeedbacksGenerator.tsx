"use client";

import React, { useState } from "react";
import { Input, Textarea } from "@heroui/input";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Alert } from "@heroui/alert";
import { LucideDownloadCloud } from "lucide-react";
import { Switch } from "@heroui/switch";
import { cn } from "@heroui/theme";

import FeedbacksForm from "@/components/sdk/index";
import { APIKEY_PREFIX, FEEDBACKS_URL } from "@/constant";

const EmbedFeedbacksGenerator: React.FC<{
  apiKey: string;
  fullWidth?: boolean;
}> = ({ apiKey, fullWidth = false }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const [theme, setTheme] = useState("light");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, setWidth] = useState<string>("400");
  // const [height, setHeight] = useState<string>("720");
  const [height, setHeight] = useState<string>("4");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showTitle, setShowTitle] = React.useState(false);
  const [showScreenshots, setShowScreenshots] = React.useState(false);
  // const embedURL = `http://localhost:3000/embed?fdb=${apiKey?.replace(APIKEY_PREFIX,"")}&theme=${theme}&width=${width}&height=${height}`;
  const embedURL = `${FEEDBACKS_URL}/embed?fdb=${apiKey?.replace(APIKEY_PREFIX, "")}`;

  const handleCopyEmbedCode = () => {
    const embedCode = `<iframe src="${embedURL}" width="${width}" height="${height}" frameborder="0"></iframe>`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(embedCode)
        .then(() => toast.success("Embed code copied successfully."))
        .catch(() => fallbackCopyToClipboard(embedCode));
    } else {
      fallbackCopyToClipboard(embedCode);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success("Embed code copied successfully.");
    } catch (err) {
      toast.error("Failed to copy embed code.");
    }
    document.body.removeChild(textarea);
  };

  return (
    <>
      <Button
        color={"danger"}
        fullWidth={fullWidth}
        startContent={<LucideDownloadCloud size={16} strokeWidth={3} />}
        onPress={onOpen}
      >
        Embed in your App
      </Button>
      <Modal
        backdrop={"blur"}
        classNames={{
          wrapper: "py-0",
          base: "lg:bg-transparent shadow-none max-md:my-1 lg:my-2",
          closeButton: "bg-danger text-content font-bold",
          body: "max-sm:px-2.5",
        }}
        isOpen={isOpen}
        scrollBehavior={showPreview ? "outside" : "normal"}
        size={"5xl"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-balance lg:text-center">
                Generate Feedbacks Form to add to your App
              </ModalHeader>
              <ModalBody>
                <div
                  className={
                    "flex max-sm:flex-col-reverse md:flex-row justify-evenly gap-x-12 gap-y-4 w-full h-full"
                  }
                >
                  <Card isPressable className={cn("lg:hidden")}>
                    <Switch
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-w-md items-center",
                          "justify-between cursor-pointer rounded-2xl gap-4 p-4 border-2 border-transparent",
                          "data-[selected=true]:border-primary",
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          //selected
                          "group-data-[selected=true]:ms-6",
                          // pressed
                          "group-data-[pressed=true]:w-7",
                          "group-data-[selected]:group-data-[pressed]:ms-4",
                        ),
                      }}
                      isSelected={showPreview}
                      onValueChange={setShowPreview}
                    >
                      <div className="flex flex-col gap-1 text-left">
                        <p className="text-medium">Show Form Preview</p>
                        <p className="text-small text-default-400">
                          See what Feedbacks Form will look like in your app or
                          website.
                        </p>
                      </div>
                    </Switch>
                  </Card>

                  <Card
                    className={cn(
                      "flex flex-col justify-start gap-8 p-5",
                      showPreview ? "max-sm:hidden" : "flex flex-col",
                    )}
                  >
                    <div className="flex items-center justify-center gap-x-4 w-full">
                      <Alert
                        classNames={{
                          base: "gap-x-4",
                        }}
                        description={
                          "Configure how the Feedbacks form will look like on your site."
                        }
                        title={"Form Configuration"}
                      />
                    </div>

                    <Switch isSelected={showTitle} onValueChange={setShowTitle}>
                      Show Title
                    </Switch>

                    <Switch
                      isSelected={showScreenshots}
                      onValueChange={setShowScreenshots}
                    >
                      Show Screenshots
                    </Switch>

                    <Input
                      label="Height"
                      labelPlacement="outside"
                      // min={560}
                      min={2}
                      placeholder="4"
                      type="number"
                      value={height}
                      onValueChange={setHeight}
                    />

                    {/*<div
                      className={
                        "flex flex-row justify-evenly items-center gap-x-4"
                      }
                    >
                      <Input
                        className="max-w-xs"
                        label="Width"
                        labelPlacement="outside"
                        min={400}
                        placeholder="400"
                        type="number"
                        value={width}
                        onValueChange={setWidth}
                      />

                      <Input
                        className="max-w-xs"
                        label="Height"
                        labelPlacement="outside"
                        // min={560}
                        min={2}
                        placeholder="4"
                        type="number"
                        value={height}
                        onValueChange={setHeight}
                      />
                    </div>*/}

                    <div>
                      <Textarea
                        fullWidth
                        isDisabled
                        label="Copy this Embed code:"
                        labelPlacement="outside"
                        maxRows={3}
                        placeholder="Feedbacks Embed content"
                        size={"lg"}
                        value={`<iframe src="${embedURL}" width="${width}" title="Send Feedbacks" height="${height}" frameborder="0"></iframe>`}
                      />
                    </div>

                    <Button color={"success"} onPress={handleCopyEmbedCode}>
                      Copy Code
                    </Button>
                  </Card>

                  <div
                    className={cn(
                      "flex flex-col w-full lg:w-5/12 space-y-2",
                      showPreview
                        ? "max-sm:flex max-sm:flex-col"
                        : "max-sm:hidden",
                    )}
                  >
                    <Alert
                      classNames={{
                        base: "gap-x-4 grow-0",
                      }}
                      color={"success"}
                      description={
                        "Form will be displayed in your app like this."
                      }
                      title={"Feedbacks Form"}
                    />
                    <Card className={"grow shrink-0"}>
                      <FeedbacksForm
                        height={Number(height)}
                        isPreview={true}
                        showScreenshots={showScreenshots}
                        showTitle={showTitle}
                        width={Number(width)}
                      />
                    </Card>
                  </div>
                </div>
              </ModalBody>
              {/*<ModalFooter>
                <Button color="danger" onPress={onClose} className={"lg:hidden"}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>*/}
            </>
          )}
        </ModalContent>
      </Modal>

      {/*<label>Theme:</label>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <label>Width:</label>
      <input type="text" value={width} onChange={(e) => setWidth(e.target.value)} />

      <label>Height:</label>
      <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} />
      <h3>Copy this Embed Code:</h3>
      <textarea
        value={`<iframe src="${embedURL}" width="${width}" title="Send Feedbacks" height="${height}" frameborder="0"></iframe>`}
        readOnly />

      <button
        onClick={() => navigator.clipboard.writeText(`<iframe src="${embedURL}" width="${width}" height="${height}" frameborder="0"></iframe>`)}>
        Copy Code
      </button>*/}
    </>
  );
};

export default EmbedFeedbacksGenerator;
