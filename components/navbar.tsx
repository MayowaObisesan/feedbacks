"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { User } from "@nextui-org/user";
import { Skeleton } from "@nextui-org/skeleton";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { useEffect } from "react";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

import SearchModal from "@/components/Modals/SearchModal";
import { parseImageHash } from "@/utils";
import { useFeedbacksContext } from "@/context";
import { supabase } from "@/utils/supabase/supabase";
import { SearchIcon, Logo, DisconnectIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

export const Navbar = () => {
  const router = useRouter();
  const { SetUser, user, userDB } = useFeedbacksContext();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      SetUser(user!);
    };

    getUser();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Profile = () => {
    const { myProfileData, isMyProfileDataFetching } = useFeedbacksContext();

    return (
      <Skeleton className="rounded-full" isLoaded={!isMyProfileDataFetching}>
        <User
          avatarProps={{
            src:
              parseImageHash(myProfileData?.profilePictureHash) ||
              "https://avatars.githubusercontent.com/u/30373425?v=4",
          }}
          description={
            <NextLink href="/app/me">@{myProfileData?.name}</NextLink>
          }
          name={myProfileData?.name}
        />
      </Skeleton>
    );
  };

  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarMenuToggle className={"sm:hidden"} />
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="max-sm:hidden font-bold text-inherit">Feedbacks</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          {/*<Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>*/}
          <ThemeSwitch />
        </NavbarItem>

        {/*{profileExist ? (
          <NavbarItem className="flex">{<Profile />}</NavbarItem>
        ) : (
          <div>
            <CreateProfileModal buttonText="Create Profile" />
          </div>
        )}*/}

        <NavbarItem className="hidden lg:flex">
          {/*{searchInput}*/}
          <SearchModal />
        </NavbarItem>

        {/* <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem> */}

        {/*<NavbarItem className="">
          <div className="flex items-center">
             <w3m-button />
             <w3m-button size="md" />
            <ConnectButton />
          </div>
        </NavbarItem>*/}

        {!user && (
          <NavbarItem>
            <Button
              // href={"/login"}
              // className="text-sm font-normal text-default-600 bg-default-100"
              color={"success"}
              startContent={<Power size={16} strokeWidth={4} />}
              variant="shadow"
              onPress={() => router.push("app/login")}
            >
              Connect Account
            </Button>
          </NavbarItem>
        )}

        {user && (
          <NavbarItem>
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: userDB?.dp || user?.user_metadata.avatar_url,
                  }}
                  className="transition-transform"
                  description={user?.email}
                  name={user?.user_metadata.full_name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">{user?.user_metadata.full_name}</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  endContent={<DisconnectIcon size={20} strokeWidth={4} />}
                  onPress={async () => await supabase.auth.signOut()}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {/*<Button variant={"flat"} isIconOnly radius={"lg"}>
          <label htmlFor={"id-search-modal"}>
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          </label>
        </Button>*/}

        <SearchModal />
        {/*<Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>*/}
        <ThemeSwitch />
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: userDB?.dp || user?.user_metadata.avatar_url,
                size: "sm",
              }}
              className="transition-transform"
              description={""}
              name={""}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{user?.user_metadata.full_name}</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback" showDivider>
              Help & Feedback
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              endContent={<DisconnectIcon size={20} strokeWidth={4} />}
              onPress={async () => await supabase.auth.signOut()}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/*
          Has been moved to before the logo
          <NavbarMenuToggle />
        */}
      </NavbarContent>

      <NavbarMenu>
        {/*{searchInput}*/}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
