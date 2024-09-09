import { Card, CardBody, CardHeader } from "@nextui-org/card";

interface IAlertProps {
  header?: string;
  body: string;
}

export const DefaultAlert = ({ header, body }: IAlertProps) => {
  return (
    <Card>
      {header !== "" && <CardHeader></CardHeader>}
      <CardBody>{body}</CardBody>
    </Card>
  );
};
