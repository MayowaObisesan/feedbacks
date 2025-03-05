import { useBrandRead } from "@/hooks/useRead";
import { IBrands, IEvents } from "@/types";
import { parseZonedDateTime } from "@internationalized/date";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Calendar } from "@nextui-org/calendar";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import {
  LucideCalendarRange,
  LucideCheck,
  LucideGlobe,
  LucideMapPin,
} from "lucide-react";
import { UserPopupCard } from "../UserCard/UserPopupCard";
import { BrandPopupCard } from "../BrandCard/BrandPopupCard";
import { useWriteContract } from "wagmi";
import { EVENT_ABI, EVENT_ADDRESS } from "@/constant";

export default function EventInviteCard(eventProps: IEvents) {
  const { data: brandData } = useBrandRead({
    functionName: "getBrand",
    args: [Number(eventProps?.eventBasicInfo.createEventBasicInfo.brandId)],
  });

  const { writeContract, isPending, isSuccess, isError } = useWriteContract();

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
  };

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

          <Tooltip
            placement="bottom"
            content={
              <BrandPopupCard
                imageHash={(brandData as IBrands)?.imageHash}
                rawName={(brandData as IBrands)?.rawName}
                userName={(brandData as IBrands)?.name}
                followersCount={(brandData as IBrands)?.followersCount}
                feedbackCount={(brandData as IBrands)?.feedbackCount}
                brandId={(brandData as IBrands)?.brandId}
              />
            }
          >
            {/* <Button variant="bordered">Hover me</Button> */}
            <p className="text-small text-default-500">
              by {(brandData as IBrands)?.name}
            </p>
          </Tooltip>
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
              <LucideMapPin size={14} color="tomato" />
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
            startContent={<LucideCalendarRange size={16} />}
            title="See Event Dates"
            classNames={{
              title: "text-sm",
            }}
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
              aria-label="Date (Read Only)"
              minValue={parseZonedDateTime(
                eventProps?.eventBasicInfo.createEventBasicInfo?.eventStartDate
              )}
              maxValue={parseZonedDateTime(
                eventProps?.eventBasicInfo.createEventBasicInfo?.eventEndDate
              )}
              focusedValue={parseZonedDateTime(
                eventProps?.eventBasicInfo.createEventBasicInfo?.eventEndDate
              )}
              weekdayStyle="short"
              isReadOnly
            />
          </AccordionItem>
        </Accordion>
      </CardBody>

      {/* <Divider /> */}
      <CardFooter className="gap-x-4">
        <Button
          variant="solid"
          color="success"
          className="flex-auto"
          onClick={handleAcceptEventInvite}
          startContent={<LucideCheck size={16} strokeWidth={4} />}
        >
          Accept Invite
        </Button>
        <Button
          variant="solid"
          color="danger"
          onClick={handleRejectEventInvite}
        >
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
