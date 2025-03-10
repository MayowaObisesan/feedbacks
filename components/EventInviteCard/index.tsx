import { parseZonedDateTime } from "@internationalized/date";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Calendar } from "@nextui-org/calendar";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import {
  LucideCalendarRange,
  LucideCheck,
  LucideGlobe,
  LucideMapPin,
} from "lucide-react";

import { IEvents } from "@/types";

export default function EventInviteCard(eventProps: IEvents) {
  /*const { data: brandData } = useBrandRead({
    functionName: "getBrand",
    args: [Number(eventProps?.eventBasicInfo.createEventBasicInfo.brandId)],
  });

  const { writeContract } = useWriteContract();

  const handleAcceptEventInvite = () => {
    writeContract({
      abi: EVENT_ABI,
      address: EVENT_ADDRESS,
      functionName: "confirmJointBrandEvent",
      args: [
        eventProps.eventBasicInfo.eventId,
        (brandData as IBrands)?.brandId,
      ],
    });
  };

  const handleRejectEventInvite = () => {
    writeContract({
      abi: EVENT_ABI,
      address: EVENT_ADDRESS,
      functionName: "removeJointBrandEvent",
      args: [
        eventProps.eventBasicInfo.eventId,
        (brandData as IBrands)?.brandId,
      ],
    });
  };*/

  return (
    <Card className="w-[320px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="full"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">
            {eventProps?.eventBasicInfo.createEventBasicInfo?.name}
          </p>

          {/*<Tooltip*/}
          {/*  content={*/}
          {/*    <BrandPopupCard*/}
          {/*      brandId={(brandData as IBrands)?.brandId!}*/}
          {/*      feedbackCount={(brandData as IBrands)?.feedbackCount}*/}
          {/*      followersCount={(brandData as IBrands)?.followersCount}*/}
          {/*      imageHash={(brandData as IBrands)?.imageHash!}*/}
          {/*      rawName={(brandData as IBrands)?.rawName}*/}
          {/*      userName={(brandData as IBrands)?.name}*/}
          {/*    />*/}
          {/*  }*/}
          {/*  placement="bottom"*/}
          {/*>*/}
          {/*  /!* <Button variant="bordered">Hover me</Button> *!/*/}
          {/*  <p className="text-small text-default-500">*/}
          {/*    by {(brandData as IBrands)?.name}*/}
          {/*  </p>*/}
          {/*</Tooltip>*/}
        </div>
      </CardHeader>
      <CardBody className="gap-y-3">
        <Divider />

        <section className="w-full">
          <div className="px-2 py-4">
            {eventProps?.eventBasicInfo.createEventBasicInfo?.description}
          </div>

          <Card className="text-sm mt-2" isHoverable={true}>
            <CardBody className="flex flex-row items-center gap-x-3">
              <LucideMapPin color="tomato" size={14} />
              <span>
                {eventProps?.eventBasicInfo.createEventBasicInfo?.eventLocation}
              </span>
            </CardBody>
          </Card>
          <Card className="text-sm mt-2" isHoverable={true}>
            <CardBody className="flex flex-row items-center gap-x-3 text-sm">
              <LucideGlobe size={14} />
              <Link
                isExternal
                showAnchorIcon
                href={
                  eventProps?.eventBasicInfo.createEventBasicInfo?.eventWebsite
                }
              >
                Go to website
              </Link>
            </CardBody>
          </Card>
        </section>

        <Accordion variant="splitted">
          <AccordionItem
            key="1"
            aria-label="Event Dates"
            classNames={{
              title: "text-sm",
            }}
            startContent={<LucideCalendarRange size={16} />}
            title="See Event Dates"
          >
            <Calendar
              // classNames={{
              //   base: "p-2 bg-orange-400 border-green-400 border-4",
              //   gridWrapper: "bg-green-400",
              //   grid: "bg-purple-300 w-full",
              //   cell: "bg-rose-400",
              //   header: "text-[8px]",
              //   pickerYearList: "bg-orange-500",
              //   gridHeaderRow: "bg-rose-400 size-4",
              //   gridHeaderCell: "text-[8px]",
              //   cellButton: "bg-orange-500 text-[8px] w-4 h-4",
              // }}
              isReadOnly
              aria-label="Date (Read Only)"
              focusedValue={parseZonedDateTime(
                eventProps?.eventBasicInfo.createEventBasicInfo?.eventEndDate,
              )}
              maxValue={parseZonedDateTime(
                eventProps?.eventBasicInfo.createEventBasicInfo?.eventEndDate,
              )}
              minValue={parseZonedDateTime(
                eventProps?.eventBasicInfo.createEventBasicInfo?.eventStartDate,
              )}
              weekdayStyle="short"
            />
          </AccordionItem>
        </Accordion>
      </CardBody>

      {/* <Divider /> */}
      <CardFooter className="gap-x-4">
        <Button
          className="flex-auto"
          color="success"
          startContent={<LucideCheck size={16} strokeWidth={4} />}
          variant="solid"
          // onClick={handleAcceptEventInvite}
        >
          Accept Invite
        </Button>
        <Button
          color="danger"
          variant="solid"
          // onClick={handleRejectEventInvite}
        >
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
