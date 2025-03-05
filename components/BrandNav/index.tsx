"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/listbox";
import { cn } from "@nextui-org/theme";
import { ListboxWrapper } from "../homeNav/ListboxWrapper";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import useRead, { useBrandRead } from "@/hooks/useRead";
import { CreateEventModal } from "../CreateEventModal";
import { useFeedbacksContext } from "@/context";
import { useCallback, useEffect, useState } from "react";
import useMyEvents from "@/hooks/useMyEvents";
import { CreateProductModal } from "../Modals/CreateProductModal";
import { IBrands } from "@/types";
import { CreateFeedbackModal } from "../Modals/CreateFeedbackModal";
import { parseImageHash } from "@/utils";
import UpdateBrandModal from "../Modals/UpdateBrandModal";
import { Address } from "viem";
import { Skeleton } from "@nextui-org/skeleton";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Divider } from "@nextui-org/divider";
import { Spacer } from "@nextui-org/spacer";
import { Button } from "@nextui-org/button";
import { DotSpacer, DynamicText } from "../TextSkeleton";
import { supabase } from "@/utils/supabase/supabase";
import { DBTables, E_DeviceWidth } from "@/types/enums";
import { toast } from "sonner";
import { useWindowSize } from "usehooks-ts";
import EmbedFeedbacksGenerator from "@/components/sdk/EmbedFeedbacksGenerator";

const iconClasses =
  "text-xl text-default-500 pointer-events-none flex-shrink-0";

const categoryList = [
  {
    name: "Technology",
    description: "Feedback on technology",
  },
  {
    name: "Games",
    description: "Feedback on games",
  },
  {
    name: "Science",
    description: "Feedback on science stuffs",
  },
  {
    name: "Art",
    description: "Feedback on arts, craft and amazing art",
  },
  {
    name: "Web3",
    description: "Feedback on web3 and blockchain stuffs",
  },
];

export default function BrandNav({ brandName, brandData, isBrandDataSuccessful }: { brandName?: string, brandData: IBrands, isBrandDataSuccessful: boolean }) {
  const {
    myAddress,
    myEventInvites,
    isMyEventInvitesFetching,
    isMyEventInvitesSuccessful,
    user
  } = useFeedbacksContext();
  const size = useWindowSize();
  const isFollowingBrand = brandData?.followers?.includes(user?.email!);
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);

  // Subscribe to updates on Brand Table
  const channels = supabase.channel('custom-update-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: DBTables.Brand },
      (payload) => {
        console.log('Change received!', payload)
      }
    )
    .subscribe()

  // const [thisBrandData, setThisBrandData] = useState<IBrands>();
  // const [isThisBrandDataFetching, setIsThisBrandDataFetching] = useState<boolean>(false);
  // const [isThisBrandDataSuccessful, setIsThisBrandDataSuccessful] = useState<boolean>(false);

/*  const {
    data: _thisBrandData,
    isFetching: isThisBrandDataFetching,
    isSuccess: isThisBrandDataSuccessful,
  } = useBrandRead({
    functionName: "getAllBrands",
    args: [brandName, "0x0000000000000000000000000000000000000000", ""],
  });

  const thisBrandData = _thisBrandData
    ? (_thisBrandData as IBrands[])[0]
    : null;

  const {
    data: thisBrandFollowersData,
    isSuccess: isBrandFollowersDataSuccessful,
  } = useBrandRead({
    functionName: "getFollowers",
    args: [thisBrandData?.brandId],
  });
  console.log(thisBrandData);*/

  // useEffect(() => {
  //   async function getBrandData() {
  //     // Initialize loading states
  //     setIsThisBrandDataFetching(true)
  //     setIsThisBrandDataSuccessful(false)
  //
  //     let { data: brand, error } = await supabase
  //       .from('Brand')
  //       .select('*')
  //       .eq('name', brandName);
  //
  //     if (brand && brand.length > 0) {
  //       setThisBrandData(brand[0] as unknown as IBrands)
  //
  //       // Finalize loading states
  //       setIsThisBrandDataFetching(false)
  //       setIsThisBrandDataSuccessful(true)
  //     }
  //
  //     if (error) {
  //       // Finalize loading states
  //       setIsThisBrandDataFetching(false)
  //       setIsThisBrandDataSuccessful(false)
  //
  //       console.error("Error fetching brand data", error)
  //     }
  //   }
  //   getBrandData();
  // }, []);

  const handleFollowBrand = async () => {
    setIsFollowLoading(true);

    if (isFollowingBrand) {
      toast.info(`You are already following ${brandData?.rawName}`, {richColors: true, duration: 3000});
      setIsFollowLoading(false);
      return;
    }

    try {
      const brandFollowers = brandData?.followers ?? [];
      console.log("brand Followers", brandFollowers);
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .update({ followers: [...brandFollowers, user?.email], followersCount: brandFollowers.length + 1 })
        .eq('id', brandData?.id)
        .select();

      if (error) {
        console.error("Error following brand", error)
        toast.error(`Unable to follow ${brandData?.rawName}`, {richColors: true, duration: 3000});
        setIsFollowLoading(false);
      }

      if (data) {
        toast.success(`You are now following ${brandData?.rawName}`, {richColors: true, duration: 3000});
        setIsFollowLoading(false);
      }
    } catch (error) {
      console.error("Error following brand", error)
      toast.error(`Unable to follow ${brandData?.rawName}`, {richColors: true, duration: 3000});
    } finally {
      setIsFollowLoading(false);
    }
  }

  const handleUnFollowBrand = async () => {
    setIsFollowLoading(true);

    if (!isFollowingBrand) {
      toast.info(`You are not following ${brandData?.rawName}`, { richColors: true, duration: 3000 });
      setIsFollowLoading(false);
      return;
    }

    try {
      const brandFollowers = brandData?.followers ?? [];
      const updatedBrandFollowers = brandFollowers.filter(email => email !== user?.email);

      const { data, error } = await supabase
        .from(DBTables.Brand)
        .update({ followers: updatedBrandFollowers, followersCount: updatedBrandFollowers.length })
        .eq('id', brandData?.id)
        .select();

      if (error) {
        console.error("Error unfollowing brand", error);
        toast.error(`Unable to unfollow ${brandData?.rawName}`, { richColors: true, duration: 3000 });
        setIsFollowLoading(false);
      }

      if (data) {
        toast.success(`You have unfollowed ${brandData?.rawName}`, { richColors: true, duration: 3000 });
        setIsFollowLoading(false);
      }
    } catch (error) {
      console.error("Error unfollowing brand", error);
      toast.error(`Unable to unfollow ${brandData?.rawName}`, { richColors: true, duration: 3000 });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const actionsList = brandData?.ownerEmail === user?.email ? [
     {
      text: "Update Brand",
      description: "",
      modal: (
        <UpdateBrandModal
          brandId={brandData ? brandData?.id : null}
          fullWidth={true}
        />
      ),
    },
      {
        text: "Embed Feedback",
        description: "Embed Feedbacks to your App",
        modal: <EmbedFeedbacksGenerator apiKey={brandData?.userApiKey!} fullWidth={true} />
      }]
    : [
      /*{
      text: "Add Event",
      description: "Add event modal",
      modal: (
        <CreateEventModal
          brandId={brandData ? brandData?.id : null}
        />
      ),
    },
    {
      text: "Add Product",
      description: "Add product modal",
      modal: (
        <CreateProductModal
          brandId={brandData ? brandData?.id : null}
          buttonText={"Add Product"}
        />
      ),
    },*/
    {
      text: "Add Feedback",
      description: "Add Feedback modal",
      modal: (
        <CreateFeedbackModal
          brandId={brandData ? brandData?.id : null}
          fullWidth={true}
        />
      ),
    }
    ];

  useEffect(() => {
    if (!isMyEventInvitesFetching) {
    }
  }, [isMyEventInvitesSuccessful]);

  return (
    <ListboxWrapper>
      <ScrollShadow hideScrollBar>
        <Listbox
          variant="flat"
          aria-label="Listbox menu with sections"
          className="flex flex-row flex-nowrap"
          emptyContent="No Categories"
        >
          <ListboxItem key={"brandProfile"} textValue="brandProfile">
            <Card isPressable={false} className="max-sm:grid max-sm:grid-cols-3 lg:grid-cols-none py-0 bg-default-200 dark:bg-default-50 shadow-none">
              <CardBody className="overflow-visible px-2">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl size-32 lg:size-72"
                  src={
                    (brandData &&
                      brandData?.brandImage) ||
                    ""
                  }
                  // width={size.width <= E_DeviceWidth.phone ? 120 : 270}
                  // height={size.width <= E_DeviceWidth.phone ? 120 : 270}
                />
              </CardBody>
              <CardHeader className="pb-0 px-4 flex-col max-sm:col-span-2 items-start">
                {/* <p className="text-tiny uppercase font-bold">Brand Details</p> */}
                {/* <small className="text-default-500">12 Tracks</small> */}
                <h4 className="font-bold text-3xl leading-normal">
                  {brandData && brandData?.rawName}
                </h4>
                 {/*{brandData?.ownerEmail}*/}
                <div className="flex items-center gap-1">
                  <DynamicText
                    isLoaded={isBrandDataSuccessful}
                    data={brandData?.followersCount}
                    textSingular="Follower"
                    textPlural="Followers"
                  />
                  <DotSpacer />
                  <DynamicText
                    isLoaded={isBrandDataSuccessful}
                    data={brandData?.feedbackCount}
                    textSingular="Feedback"
                    textPlural="Feedbacks"
                  />
                </div>
                <Spacer y={2} />
                <div onClick={!user?.email ? () => toast("You need to login to follow a brand") : () => {}}>
                  {isFollowingBrand
                    ? <Button color={"danger"} variant={"solid"} onPress={handleUnFollowBrand} isLoading={isFollowLoading}>Unfollow</Button>
                    : <Button color={"primary"} onPress={handleFollowBrand} isLoading={isFollowLoading} isDisabled={!user?.email}>Follow</Button>
                  }
                </div>
                {myEventInvites?.length > 0 && (
                  <section className="space-y-3 w-full">
                    <Spacer y={4} />
                    <Divider />
                    <Spacer y={4} />
                    <Button
                      fullWidth
                      color="danger"
                      variant="shadow"
                      startContent={
                        <span className="font-bold">
                          {myEventInvites?.length}
                        </span>
                      }
                    >
                      {myEventInvites?.length > 1
                        ? "Pending Invites"
                        : "Pending Invite"}
                    </Button>
                    {/* <div className="text-danger text-medium">
                      <span className="font-bold">
                        {myEventInvites?.length}{" "}
                      </span>
                      {myEventInvites?.length > 1
                        ? "Pending Invites"
                        : "Pending Invite"}
                    </div> */}
                  </section>
                )}
                <Spacer y={4} />
              </CardHeader>
            </Card>
          </ListboxItem>
          <ListboxSection
            title="Actions"
            // showDivider
            className="grow shrink-0 lg:space-y-4 px-2 lg:px-4"
            items={actionsList}
            itemClasses={{
              base: "",
              wrapper: "",
            }}
            classNames={{
              base: "",
              group: "lg:space-y-4 max-sm:flex max-sm:flex-row max-sm:items-center",
              heading: "max-sm:hidden text-2xl font-bold lg:py-4",
            }}
          >
            {(eachAction) => (
              <ListboxItem
                key={eachAction.text.toLocaleLowerCase()}
                // description={eachAction.description}
                textValue={eachAction.text}
                className={""}
                classNames={{base: "max-sm:grow"}}
              >
                {eachAction.modal}
              </ListboxItem>
            )}
          </ListboxSection>
          <ListboxSection
            hidden
            title="Categories"
            showDivider
            className="grow shrink-0 space-y-4 px-4"
            items={categoryList}
            itemClasses={{
              base: "",
              wrapper: "",
            }}
            classNames={{
              base: "",
              group: "space-y-4",
              heading: "text-base py-4",
            }}
          >
            {(eachCategory) => (
              <ListboxItem
                key={eachCategory.name.toLowerCase()}
                description={eachCategory.description}
                className=""
              >
                {eachCategory.name}
              </ListboxItem>
            )}
          </ListboxSection>
          <ListboxSection hidden title="Danger zone" className="grow-0 shrink">
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              description="Permanently delete the file"
            >
              Delete file
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      </ScrollShadow>
    </ListboxWrapper>
  );
}
