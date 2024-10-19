import { Card, CardBody } from "@nextui-org/card";

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="bg-transparent shadow-none w-full">
      <CardBody className="flex items-center justify-center h-[200px]">
        <div className="text-3xl text-gray-600 text-center leading-loose">
          {children}
        </div>
      </CardBody>
    </Card>
  );
}

export default EmptyCard;
