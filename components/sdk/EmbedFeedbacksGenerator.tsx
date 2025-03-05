"use client";

import React, { useState } from "react";
import { APIKEY_PREFIX } from "@/constant";
import { Input, Textarea } from "@nextui-org/input";
import FeedbacksForm from "@/components/sdk/index";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Alert } from "@heroui/alert";
import { LucideDownload, LucideDownloadCloud } from "lucide-react";
import { Switch } from "@nextui-org/switch";
import { cn } from "@nextui-org/theme";

const EmbedFeedbacksGenerator: React.FC<{ apiKey: string; fullWidth?: boolean }> = ({ apiKey, fullWidth=false }) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [theme, setTheme] = useState("light");
  const [width, setWidth] = useState<string>("400");
  const [height, setHeight] = useState<string>("720");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  // const embedURL = `http://localhost:3000/embed?fdb=${apiKey?.replace(APIKEY_PREFIX,"")}&theme=${theme}&width=${width}&height=${height}`;
  const embedURL = `http://localhost:3000/embed?fdb=${apiKey?.replace(APIKEY_PREFIX, "")}`;

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(`<iframe src="${embedURL}" width="${width}" height="${height}" frameborder="0"></iframe>`);
    toast.success("Embed code copied successfully.");
  };

  return (
    <>
      <Button fullWidth={fullWidth} onPress={onOpen} color={"danger"} startContent={<LucideDownloadCloud size={16} strokeWidth={3} />}>Embed to your App</Button>
      <Modal size={"5xl"} backdrop={"blur"} scrollBehavior={showPreview ? "outside" : "normal"} isOpen={isOpen} onOpenChange={onOpenChange} classNames={{
        wrapper: "py-0",
        base: "lg:bg-transparent shadow-none max-md:my-1 lg:my-2",
        closeButton: "bg-danger text-content font-bold",
        body: "max-sm:px-2.5"
      }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-balance lg:text-center">Generate Feedbacks Form to add to your App</ModalHeader>
              <ModalBody>

                <div className={"flex max-sm:flex-col-reverse md:flex-row justify-evenly gap-x-12 gap-y-4 w-full h-full"}>
                  <Card isPressable className={cn("lg:hidden")}>
                    <Switch
                      isSelected={showPreview}
                      onValueChange={setShowPreview}
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
                    >
                      <div className="flex flex-col gap-1 text-left">
                        <p className="text-medium">Show Form Preview</p>
                        <p className="text-small text-default-400">
                          See what Feedbacks Form will look like in your app or website.
                        </p>
                      </div>
                    </Switch>
                  </Card>

                  <Card className={cn("flex flex-col justify-start gap-8 p-5", showPreview ? "max-sm:hidden" : "flex flex-col")}>
                    <div className="flex items-center justify-center gap-x-4 w-full">
                      <Alert
                        description={"Configure how the Feedbacks page will look like on your site."}
                        title={"Embed Configuration"}
                        classNames={{
                          base: "gap-x-4"
                        }}
                      />
                    </div>
                    <div className={"flex flex-row justify-evenly items-center gap-x-4"}>
                      <Input
                        label="Width"
                        labelPlacement="outside"
                        placeholder="400"
                        type="number"
                        value={width}
                        min={400}
                        onValueChange={setWidth}
                        className="max-w-xs"
                      />

                      <Input
                        label="Height"
                        labelPlacement="outside"
                        placeholder="720"
                        type="number"
                        value={height}
                        min={560}
                        onValueChange={setHeight}
                        className="max-w-xs"
                      />
                    </div>

                    <div>
                      <Textarea
                        isDisabled
                        fullWidth
                        size={"lg"}
                        label="Copy this Embed code:"
                        labelPlacement="outside"
                        placeholder="Feedbacks Embed content"
                        value={`<iframe src="${embedURL}" width="${width}" title="Send Feedbacks" height="${height}" frameborder="0"></iframe>`}
                        minRows={6}
                      />
                    </div>

                    <Button
                      color={"success"}
                      onClick={handleCopyEmbedCode}>
                      Copy Code
                    </Button>
                  </Card>

                  <div className={cn("flex flex-col w-full lg:w-5/12 space-y-2", showPreview ? "max-sm:flex max-sm:flex-col" : "max-sm:hidden")}>
                    <Alert
                      color={"success"}
                      description={"Form will be displayed in your app like this."}
                      title={"Feedbacks Form"}
                      classNames={{
                        base: "gap-x-4"
                      }}
                    />
                    <Card>
                      <FeedbacksForm width={Number(width)} height={Number(height)} isPreview={true} />
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
