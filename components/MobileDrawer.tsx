"use client";

import { Button } from "@heroui/button";
import {
  LucideBarChart,
  LucideChartNoAxesGantt,
  LucideHome,
  LucideLayoutDashboard,
  LucideLayoutTemplate,
} from "lucide-react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { useDisclosure } from "@heroui/modal";
import { Avatar, AvatarIcon } from "@heroui/avatar";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/listbox";
import React from "react";
import { useRouter } from "next/navigation";
import { Chip } from "@heroui/chip";
import { useUser } from "@clerk/nextjs";

import { ThemeSwitch } from "@/components/theme-switch";
import {
  useRealTimeUsers,
  useUserAndUserDBQuery,
} from "@/hooks/useFeedbackUser";
import { useRealTimeBrands } from "@/hooks/useBrands";

export default function MobileDrawer() {
  useRealTimeUsers();
  useRealTimeBrands();

  const { user } = useUser();
  const { data: userAndUserDB } = useUserAndUserDBQuery();

  const { userDB, myBrands } = userAndUserDB || {};
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const { userDB } = useFeedbacksContext();
  // const email = userDB?.email;
  // const { data: myBrands } = useMyBrands(email!);

  return (
    <div>
      <Button
        isIconOnly
        className={"hidden"}
        id={"id-mobile-drawer"}
        onPress={onOpen}
      >
        <LucideChartNoAxesGantt />
      </Button>
      <Drawer
        className={"max-w-64"}
        isOpen={isOpen}
        placement={"left"}
        size={"xs"}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-2 py-8">
                <div className="flex items-center gap-3">
                  <Avatar
                    isBordered
                    color="primary"
                    fallback={<AvatarIcon />}
                    name="Profile Pic"
                    size="md"
                    src={userDB?.dp || user?.imageUrl}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {user?.fullName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                </div>
              </DrawerHeader>

              <DrawerBody className="px-2">
                <Listbox
                  aria-label="Main Menu"
                  className="mt-2 gap-y-8 space-y-16"
                  variant="flat"
                  // onAction={(key) => console.log(key)}
                >
                  <ListboxSection
                    className="grow shrink-0 space-y-4 mt-4 px-2"
                    classNames={{
                      base: "",
                      group: "space-y-4",
                      heading: "text-base py-4",
                    }}
                    showDivider={false}
                    title="Menu"
                  >
                    <ListboxItem
                      key="home"
                      href={"/app"}
                      startContent={<LucideHome size={16} />}
                    >
                      Home
                    </ListboxItem>
                    <ListboxItem
                      key="brands"
                      href={"/app/brand"}
                      startContent={<LucideLayoutTemplate size={16} />}
                    >
                      Brands
                    </ListboxItem>
                    <ListboxItem
                      key="dashboard"
                      href={"/app/dashboard"}
                      startContent={<LucideLayoutDashboard size={16} />}
                    >
                      Dashboard
                    </ListboxItem>
                    <ListboxItem
                      key="analytics"
                      className={"justify-between"}
                      endContent={
                        <Chip color="danger" size={"sm"}>
                          Soon
                        </Chip>
                      }
                      isDisabled={true}
                      startContent={<LucideBarChart size={16} />}
                    >
                      Analytics
                    </ListboxItem>
                    {/*<ListboxItem
                      key="projects"
                      startContent={<LucideFolder size={16} />}
                    >
                      Projects
                    </ListboxItem>
                    <ListboxItem
                      key="tasks"
                      startContent={<LucideCircleCheck size={16} />}
                    >
                      Tasks
                    </ListboxItem>*/}
                  </ListboxSection>

                  <ListboxSection
                    className="grow shrink-0 space-y-4 mt-8 px-2"
                    classNames={{
                      base: "",
                      group: "space-y-4",
                      heading: "text-base py-4",
                    }}
                    itemClasses={{
                      base: "",
                      wrapper: "",
                    }}
                    items={myBrands || []}
                    showDivider={false}
                    title="Your Brands"
                  >
                    {(eachBrand) => (
                      <ListboxItem
                        key={eachBrand.name.toLowerCase()}
                        className=""
                        description={eachBrand?.description}
                        startContent={
                          <div
                            className={
                              "flex items-center rounded-small justify-center w-5 h-5"
                            }
                          >
                            <Avatar
                              isBordered
                              className={"w-5 h-5"}
                              color="primary"
                              name="Profile Pic"
                              size="sm"
                              src={eachBrand.brand_image!}
                            />
                          </div>
                        }
                        onPress={() =>
                          router.push(`/app/brand/${eachBrand.name}`)
                        }
                      >
                        {eachBrand.raw_name}
                      </ListboxItem>
                    )}
                  </ListboxSection>
                </Listbox>
              </DrawerBody>
              <DrawerFooter>
                {/*<Button
                  className="w-full justify-start"
                  color="danger"
                  startContent={<LucideLogOut size={16} />}
                  variant="flat"
                  onPress={onClose}
                >
                  Logout
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>*/}
                <ThemeSwitch />
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
