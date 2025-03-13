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
import { LucidePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import { DateValue, parseAbsoluteToLocal } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { DateRangePicker } from "@heroui/date-picker";
import { RangeValue } from "@react-types/shared";
import { zeroAddress } from "viem";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Chip } from "@heroui/chip";

import { SearchIcon } from "./icons";

import { useBrandRead } from "@/hooks/useRead";
import { EVENT_ABI, EVENT_ADDRESS } from "@/constant";
import { useFeedbacksContext } from "@/context";
import { IBrands } from "@/types";

export function CreateEventModal({
  brandId,
  buttonText = "Add Event",
}: {
  brandId: number | null;
  buttonText?: string;
}) {
  const { myAddress } = useFeedbacksContext();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { writeContract, isPending, isSuccess, isError, error } =
    useWriteContract();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [eventLocation, setEventLocation] = useState<string>("");
  // const [eventDate, setEventDate] = useState<string>("");
  const [eventWebsite, setEventWebsite] = useState<string>("");
  const [eventRegistrationLink, setEventRegistrationLink] =
    useState<string>("");
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [brandIds, setBrandIds] = useState<number[]>([]);
  let [eventDuration, setEventDuration] = React.useState<RangeValue<DateValue>>(
    {
      start: parseAbsoluteToLocal(new Date().toISOString()), // parseZonedDateTime("2024-04-09T00:45[America/Los_Angeles]"), ,
      end: parseAbsoluteToLocal(new Date().toISOString()), // parseAbsoluteToLocal("2021-04-14T19:15:22Z"),
    },
  );
  const [brandSearch, setBrandSearch] = useState<string>("");
  const [brandSearchResults, setBrandSearchResults] = useState<IBrands[]>([]);
  //   const readCallback = useReadCallback();
  const [brandSelected, setBrandSelected] = React.useState<Set<string>>(
    new Set([""]),
  );

  const brandArrayValues = Array.from(brandSelected);

  const { data } = useBrandRead({
    functionName: "getAllBrands",
    args: [brandSearch, zeroAddress, ""],
  });

  const onCreateEvent = () => {
    writeContract({
      abi: EVENT_ABI,
      address: EVENT_ADDRESS,
      functionName: "createEvent",
      args: [
        [
          [
            myAddress,
            brandId,
            name,
            description,
            eventLocation,
            eventDuration.start,
            eventDuration.end,
            eventWebsite,
            eventRegistrationLink,
            brandArrayValues.map(Number),
          ],
          ["", ""],
        ],
      ],
    });
  };

  const searchBrands = () => {
    // Fetch all the brands
    // console.log(data);
    setBrandSearchResults(data as unknown as IBrands[]);
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      toast.success("Event created successfully.");
    }

    if (isError) {
      toast.error(`Unable to create Event ${error.message}`);
    }
  }, [isSuccess, isError]);

  const topContent = React.useMemo(() => {
    if (!brandSearchResults?.length) {
      return null;
    }

    // console.log(
    //   brandId,
    //   brandArrayValues,
    //   brandIds,
    //   brandArrayValues.map(Number),
    // );

    return (
      <ScrollShadow
        hideScrollBar
        className="w-full flex py-0.5 px-2 gap-1"
        orientation="horizontal"
      >
        {brandArrayValues.map((value) => (
          <Chip key={value}>
            {
              brandSearchResults.find((_) => `${_.brandId}` === `${value}`)
                ?.name
            }
          </Chip>
        ))}
      </ScrollShadow>
    );
  }, [brandSelected, brandArrayValues.length]);

  return (
    <>
      <Button
        color="success"
        startContent={<LucidePlus size={16} strokeWidth={4} />}
        variant="shadow"
        onPress={onOpen}
      >
        {buttonText}
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          base: "px-3 py-4 max-w-xl",
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/80 backdrop-opacity-90",
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
                Add an Event
              </ModalHeader>
              <ModalBody className="space-y-4">
                {/* TODO:
                1. Use a Left panel for the event creation menus
                2. Add the Event Image - It's own panel
                3. Name, Description and Category - It's own panel
                4. Location - It's own panel
                5. Website and Registration Link - It's own panel
                6. Event Duration (Big Calendar selection) - It's own Panel
                7. Event Brands - It's own panel
                 */}
                <div>
                  <Input
                    // autoFocus
                    isRequired
                    label="Name"
                    placeholder="The event name"
                    value={name}
                    variant="flat"
                    onValueChange={setName}
                  />
                  <Textarea
                    className=""
                    label="Event description"
                    placeholder="Desribe the Event"
                    value={description}
                    onValueChange={setDescription}
                  />
                  <Textarea
                    className=""
                    description={
                      "The Location for this event. Google embed is allowed"
                    }
                    label="Location..."
                    placeholder="Location of this event"
                    value={eventLocation}
                    onValueChange={setEventLocation}
                  />
                  <Input
                    isRequired
                    label="Website"
                    placeholder="Website for the event or your website."
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">
                          https://
                        </span>
                      </div>
                    }
                    type="url"
                    value={eventWebsite}
                    variant="flat"
                    onValueChange={setEventWebsite}
                  />
                  <Input
                    isRequired
                    description="Enter the registration link for this event"
                    label="Registration Link"
                    placeholder="The registration link for the event"
                    type="text"
                    value={eventRegistrationLink}
                    variant="flat"
                    onValueChange={setEventRegistrationLink}
                  />
                  <I18nProvider locale="en-us">
                    <DateRangePicker
                      label="Event duration"
                      // @ts-ignore
                      value={eventDuration}
                      // @ts-ignore
                      onChange={setEventDuration}
                    />
                  </I18nProvider>
                  <Input
                    isClearable
                    classNames={{
                      label: "text-black/50 dark:text-white/90",
                      input: [
                        "bg-transparent",
                        "text-black/90 dark:text-white/90",
                        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                      ],
                      innerWrapper: "bg-transparent",
                      inputWrapper: [
                        "shadow-xl",
                        "bg-default-200/50",
                        "dark:bg-default/60",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                        "hover:bg-default-200/70",
                        "dark:hover:bg-default/70",
                        "group-data-[focus=true]:bg-default-200/50",
                        "dark:group-data-[focus=true]:bg-default/60",
                        "!cursor-text",
                      ],
                    }}
                    label="Event Brands"
                    placeholder="Search brands"
                    radius="lg"
                    startContent={
                      <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                    }
                    onChange={(e) => {
                      // console.log("setbrandIds log target", e.target.value);
                      setBrandIds((prev) => [
                        prev.push(Number(e.target.value)),
                      ]);
                    }}
                    onKeyUp={searchBrands}
                    onValueChange={setBrandSearch}
                  />
                  <Listbox
                    classNames={{
                      base: "w-full",
                      list: "max-h-[300px] overflow-scroll",
                    }}
                    items={brandSearchResults ?? []}
                    //   defaultSelectedKeys={["1"]}
                    label="Assigned to"
                    selectionMode="multiple"
                    topContent={topContent}
                    variant="flat"
                    // @ts-ignore
                    onSelectionChange={setBrandSelected}
                  >
                    {(item) => (
                      <ListboxItem
                        key={item?.brandId as number}
                        textValue={item?.name}
                      >
                        <div className="flex gap-2 items-center">
                          {/* <Avatar
                          alt={item.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={item.avatar}
                        /> */}
                          <div className="flex flex-col">
                            <span className="text-small">{item?.name}</span>
                            {/* <span className="text-tiny text-default-400">
                            {item.email}
                          </span> */}
                          </div>
                        </div>
                      </ListboxItem>
                    )}
                  </Listbox>
                </div>
                {/* <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered">Open Menu</Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Dynamic Actions"
                    items={brandSearchResults}
                  >
                    {(item) => (
                      <DropdownItem key={item.name}>{item.name}</DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown> */}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  isLoading={isPending}
                  onPress={onCreateEvent}
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
