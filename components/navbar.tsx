"use client";

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { User } from "@heroui/user";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { LucideChartNoAxesGantt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import * as React from "react";

import SearchModal from "@/components/Modals/SearchModal";
import { useFeedbacksContext } from "@/context";
import { DisconnectIcon, FeedbacksLogo, SearchIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { useUserAndUserDBQuery } from "@/hooks/useFeedbackUser";

export function Navbar() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { SetUser } = useFeedbacksContext();
  const { data: userAndUserDB } = useUserAndUserDBQuery();
  const { userDB } = userAndUserDB || {};

  /*
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      SetUser(user!);
    };

    getUser();
  }, []);
*/

  // @ts-ignore
  async function handleSignOut() {
    try {
      // Sign out from Supabase
      // await supabase.auth.signOut();

      // Clear user context
      SetUser(null);

      // Redirect to home or login page
      // router.push('/');

      // Clear the cache
      queryClient.invalidateQueries({ queryKey: ["userAndUserDB"] });

      // Optional: Force refresh to ensure all authenticated states are cleared
      router.refresh();
    } catch (error) {
      // console.error('Error signing out:', error);
    }
  }

  function SignInButton() {
    return (
      <NavbarItem>
        <Button
          color={"success"}
          variant="shadow"
          onPress={() => router.push("/sign-in")}
        >
          Sign in
        </Button>
      </NavbarItem>
    );
  }

  function DropDownView() {
    return (
      <NavbarItem className={"flex flex-col justify-center items-center"}>
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: userDB?.dp || user?.imageUrl,
                size: "sm",
              }}
              className="transition-transform"
              description={""}
              name={""}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem
              key="profile"
              as={Link}
              className="h-14 gap-2 text-foreground"
              href={"/app/me"}
            >
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{user?.fullName}</p>
            </DropdownItem>
            {/*<DropdownItem key="settings" href={"/app/me"}>
              My Profile
            </DropdownItem>*/}
            {/*<DropdownItem key="settings">Settings</DropdownItem>*/}
            {/*<DropdownItem key="team_settings">Team Settings</DropdownItem>*/}
            <DropdownItem key="analytics" isDisabled>
              Analytics
            </DropdownItem>
            {/*<DropdownItem key="system">System</DropdownItem>*/}
            {/*<DropdownItem key="configurations">Configurations</DropdownItem>*/}
            <DropdownItem key="help_and_feedback" showDivider href={"/app/brand/feedbacks"}>
              Help & Feedback
            </DropdownItem>
            {/*<DropdownItem
              key="logout"
              color="danger"
              endContent={<DisconnectIcon size={20} strokeWidth={4} />}
              onPress={handleSignOut}
            >
              Log Out
            </DropdownItem>*/}
            <DropdownItem
              key="signout"
              as={Button}
              className={"text-left"}
              color="danger"
              endContent={<DisconnectIcon size={20} strokeWidth={4} />}
              variant={"light"}
              onPress={handleSignOut}
            >
              <SignOutButton />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
    );
  }

  return (
    <NextUINavbar
      className={""}
      classNames={{
        base: "",
        wrapper: "px-2",
        content: "",
        menu: "",
      }}
      maxWidth="full"
      position={"sticky"}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <Button isIconOnly className={"hidden max-md:flex"} variant={"light"}>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor={"id-mobile-drawer"}>
            <LucideChartNoAxesGantt />
          </label>
        </Button>
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <FeedbacksLogo />
            <p className="max-sm:hidden font-bold text-inherit">Feedbacks</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href + item.label}>
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
        {/*<NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>*/}

        <NavbarItem className="hidden lg:flex">
          <div className="flex flex-wrap gap-3">
            <Button isIconOnly radius={"full"} variant={"flat"}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor={"id-search-modal"}>
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
              </label>
            </Button>
          </div>
          <SearchModal />
        </NavbarItem>

        <NavbarItem>
          {/* @ts-ignore */}
          <SignedOut>
            <SignInButton />
          </SignedOut>
          {/* @ts-ignore */}
          <SignedIn>
            <DropDownView />
          </SignedIn>
        </NavbarItem>

        {/*<NavbarItem className="">
          {userAndUserDBFetched ? (
            user?.email ? (
              <DropDownView />
            ) : (
              <SignInButton />
            )
          ) : null}
        </NavbarItem>*/}
        {/*{!userAndUserDBLoading && !user?.email && <SignInButton />}*/}
        {/*{user?.email && <DropDownView />}*/}
      </NavbarContent>

      {/* MOBILE NAV VIEW */}
      <NavbarContent
        className="sm:hidden basis-1 items-center pl-4"
        justify="end"
      >
        <NavbarItem>
          <div className="flex flex-wrap gap-3">
            <Button isIconOnly radius={"full"} variant={"flat"}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor={"id-search-modal"}>
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
              </label>
            </Button>
          </div>
        </NavbarItem>

        {/* @ts-ignore */}
        <SignedIn>
          <DropDownView />
        </SignedIn>
        {/* @ts-ignore */}
        <SignedOut>
          <SignInButton />
        </SignedOut>

        {/*{!user?.email && <SignInButton />}

        {user?.email && <DropDownView />}*/}
      </NavbarContent>
    </NextUINavbar>
  );
}

/*

export const NavbarOld = () => {
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
  /!*const searchInput = (
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
  );*!/

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /!*const Profile = () => {
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
  };*!/

  return (
    <NextUINavbar
      className={""}
      classNames={{
        base: "",
        wrapper: "px-2",
        content: "",
        menu: "",
      }}
      maxWidth="full"
      position={"sticky"}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <Button isIconOnly className={"hidden max-md:flex"} variant={"light"}>
          {/!* eslint-disable-next-line jsx-a11y/label-has-associated-control *!/}
          <label htmlFor={"id-mobile-drawer"}>
            <LucideChartNoAxesGantt />
          </label>
        </Button>
        {/!*<NavbarMenuToggle className={"sm:hidden"} />*!/}
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <FeedbacksLogo />
            <p className="max-sm:hidden font-bold text-inherit">Feedbacks</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href + item.label}>
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
          {/!*<Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>*!/}
          <ThemeSwitch />
        </NavbarItem>

        {/!*{profileExist ? (
          <NavbarItem className="flex">{<Profile />}</NavbarItem>
        ) : (
          <div>
            <CreateProfileModal buttonText="Create Profile" />
          </div>
        )}*!/}

        <NavbarItem className="hidden lg:flex">
          {/!*{searchInput}*!/}
          <div className="flex flex-wrap gap-3">
            <Button isIconOnly radius={"full"} variant={"flat"}>
              {/!* eslint-disable-next-line jsx-a11y/label-has-associated-control *!/}
              <label htmlFor={"id-search-modal"}>
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
              </label>
            </Button>
          </div>
          <SearchModal />
        </NavbarItem>

        {/!* <NavbarItem className="hidden md:flex">
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
        </NavbarItem> *!/}

        {/!*<NavbarItem className="">
          <div className="flex items-center">
             <w3m-button />
             <w3m-button size="md" />
            <ConnectButton />
          </div>
        </NavbarItem>*!/}

        {!user?.email && (
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

        {user?.email && (
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

      {/!* MOBILE NAV VIEW *!/}
      <NavbarContent
        className="sm:hidden basis-1 items-center pl-4"
        justify="end"
      >
        {/!*<Button variant={"flat"} isIconOnly radius={"lg"}>
          <label htmlFor={"id-search-modal"}>
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          </label>
        </Button>*!/}

        <NavbarItem>
          <div className="flex flex-wrap gap-3">
            <Button isIconOnly radius={"full"} variant={"flat"}>
              {/!* eslint-disable-next-line jsx-a11y/label-has-associated-control *!/}
              <label htmlFor={"id-search-modal"}>
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
              </label>
            </Button>
          </div>
          {/!*<SearchModal />*!/}
        </NavbarItem>

        {/!*<Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>*!/}
        <ThemeSwitch />

        {!user?.email && (
          <NavbarItem>
            <Button
              // href={"/login"}
              // className="text-sm font-normal text-default-600 bg-default-100"
              color={"success"}
              variant="shadow"
              onPress={() => router.push("/app/login")}
            >
              Sign in
            </Button>
          </NavbarItem>
        )}

        {user?.email && (
          <NavbarItem>
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
                <DropdownItem
                  key="profile"
                  as={Link}
                  className="h-14 gap-2 text-foreground"
                  href={"/app/me"}
                >
                  <p className="font-bold">Signed in as</p>
                  <p className="font-bold">{user?.user_metadata.full_name}</p>
                </DropdownItem>
                <DropdownItem key="settings" href={"/app/me"}>
                  My Profile
                </DropdownItem>
                <DropdownItem key="settings">Settings</DropdownItem>
                {/!*<DropdownItem key="team_settings">Team Settings</DropdownItem>*!/}
                <DropdownItem key="analytics">Analytics</DropdownItem>
                {/!*<DropdownItem key="system">System</DropdownItem>*!/}
                {/!*<DropdownItem key="configurations">Configurations</DropdownItem>*!/}
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
          </NavbarItem>
        )}

        {/!*
          Has been moved to before the logo
          <NavbarMenuToggle />
        *!/}
      </NavbarContent>

      {/!*<NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
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
      </NavbarMenu>*!/}
    </NextUINavbar>
  );
};
*/
