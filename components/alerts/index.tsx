import { Card, CardBody, CardHeader } from "@heroui/card";

interface IAlertProps {
  header?: string;
  body: string;
}

export const DefaultAlert = ({ header, body }: IAlertProps) => {
  return (
    <Card>
      {header !== "" && <CardHeader />}
      <CardBody>{body}</CardBody>
    </Card>
  );
};
