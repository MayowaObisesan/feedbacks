// app/tabs/page.tsx
"use client";

import { usePathname } from "next/navigation";
import { Tab, Tabs } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";

export function ExampleClientRouterWithTabs() {
  const pathname = usePathname();

  return (
    <Tabs
      fullWidth
      aria-label="Options"
      selectedKey={pathname}
      size={"lg"}
      variant={"underlined"}
    >
      <Tab key="photos" href="/app" title="Home">
        <Card>
          <CardBody>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </CardBody>
        </Card>
      </Tab>
      <Tab key="music" href="/app/brand" title="Brand">
        <Card>
          <CardBody>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </CardBody>
        </Card>
      </Tab>
      <Tab key="videos" href="/app/me" title="Me">
        <Card>
          <CardBody>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  );
}
