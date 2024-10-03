import useRead from "@/hooks/useRead";
import { IEvents } from "@/types";
import { parseZonedDateTime } from "@internationalized/date";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/button";
import { Calendar } from "@nextui-org/calendar";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { LucideCalendarRange, LucideGlobe, LucideMapPin } from "lucide-react";

export default function EventInviteCard(eventProps: IEvents) {
  const { data: brandData } = useRead({
    functionName: "getBrand",
    args: [Number(eventProps?.brandId)],
  });

  const handleAcceptEventInvite = () => {};
  const handleRejectEventInvite = () => {};

  return (
    <Card className="w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="full"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{eventProps.name}</p>
          <p className="text-small text-default-500">by {brandData?.name}</p>
        </div>
      </CardHeader>
      <CardBody className="gap-y-3">
        <Divider />

        <section className="w-full">
          <div className="px-2 py-4">{eventProps.description}</div>

          <Card className="text-sm mt-2" isHoverable={true}>
            <CardBody className="flex flex-row items-center gap-x-3">
              <LucideMapPin size={14} color="tomato" />
              <span>{eventProps.eventLocation}</span>
            </CardBody>
          </Card>
          <Card className="text-sm mt-2" isHoverable={true}>
            <CardBody className="flex flex-row items-center gap-x-3 text-sm">
              <LucideGlobe size={14} />
              <Link isExternal showAnchorIcon href={eventProps.eventWebsite}>
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
              minValue={parseZonedDateTime(eventProps.eventStartDate)}
              maxValue={parseZonedDateTime(eventProps.eventEndDate)}
              focusedValue={parseZonedDateTime(eventProps.eventEndDate)}
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
