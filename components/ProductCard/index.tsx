import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

import { parseImageHash } from "@/utils";

interface IProductCard {
  productId: number;
  name: string;
  description: string;
  brandId: number;
  createdAt: number;
  imageHash: string;
}

function ProductCard(props: IProductCard) {
  return (
    <Card className="py-4 max-w-80">
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={parseImageHash(props.imageHash)}
          width={"100%"}
        />
      </CardBody>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        {/* <p className="text-tiny uppercase font-bold">
          {formatDate(Number(props.createdAt))}
        </p> */}
        <h4 className="font-bold text-medium">Frontend Radio - {props.name}</h4>
        <small className="text-default-500">{props.description}</small>
        {/* <div className="text-sm">{props.description}</div> */}
      </CardHeader>
    </Card>
  );
}

export default ProductCard;
