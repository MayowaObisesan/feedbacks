"use client";

import { Listbox, ListboxItem, ListboxSection } from "@heroui/listbox";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { useState } from "react";
import { Spacer } from "@heroui/spacer";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { Skeleton } from "@heroui/skeleton";
import { useUser } from "@clerk/nextjs";

import UpdateBrandModal from "../Modals/UpdateBrandModal";
import { CreateFeedbackModal } from "../Modals/CreateFeedbackModal";
import { DotSpacer, DynamicText } from "../TextSkeleton";
import { ListboxWrapper } from "../homeNav/ListboxWrapper";

import EmbedFeedbacksGenerator from "@/components/sdk/EmbedFeedbacksGenerator";
import { BrandNavSkeleton } from "@/components/Skeletons/BrandNavSkeleton";
import { ExtendedBrand } from "@/types";
import {
  useFollowBrand,
  useRealTimeBrands,
  useRealTimeBrandsFollowers,
  useUnfollowBrand,
} from "@/hooks/useBrands";
import { useRealTimeFeedbacks } from "@/hooks/useFeedbacks";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const iconClasses =
//   "text-xl text-default-500 pointer-events-none flex-shrink-0";

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

export default function BrandNav({
  brandData,
  isBrandDataSuccessful,
}: {
  brandName?: string;
  brandData: ExtendedBrand;
  isBrandDataSuccessful: boolean;
}) {
  useRealTimeBrands();
  useRealTimeFeedbacks();
  useRealTimeBrandsFollowers();

  const { user, isLoaded: userLoaded } = useUser();
  /*const isFollowingBrand = brandData?.followers?.includes(
    user?.primaryEmailAddress?.emailAddress!,
  );*/
  const isFollowingBrand = brandData?.is_following;
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);
  const followBrand = useFollowBrand();
  const unfollowBrand = useUnfollowBrand();

  // Subscribe to updates on Brand Table
  /*const channels = supabase
    .channel("custom-update-channel")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: DBTables.Brand },
      (payload) => {
        console.log("Change received!", payload);
      },
    )
    .subscribe();*/

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
      toast.info(`You are already following ${brandData?.raw_name}`, {
        richColors: true,
        duration: 3000,
      });
      setIsFollowLoading(false);

      return;
    }

    try {
      const response = await followBrand.mutateAsync({
        brand_id: brandData?.id!,
        user_id: user?.id,
      });

      if (response) {
        toast.success(`You are now following ${brandData?.raw_name}`, {
          richColors: true,
          duration: 3000,
        });
      }

      /*const brandFollowers = brandData?.followers ?? [];

      // console.log("brand Followers", brandFollowers);
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .update({
          followers: [
            ...brandFollowers,
            user?.primaryEmailAddress?.emailAddress,
          ],
          followersCount: brandFollowers.length + 1,
        })
        .eq("id", brandData?.id)
        .select();

      if (error) {
        // console.error("Error following brand", error);
        toast.error(`Unable to follow ${brandData?.raw_name}`, {
          richColors: true,
          duration: 3000,
        });
        setIsFollowLoading(false);
      }

      if (data) {
        toast.success(`You are now following ${brandData?.raw_name}`, {
          richColors: true,
          duration: 3000,
        });
        setIsFollowLoading(false);
      }*/
    } catch (error) {
      // console.error("Error following brand", error);
      toast.error(`Unable to follow ${brandData?.raw_name}`, {
        richColors: true,
        duration: 3000,
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleUnFollowBrand = async () => {
    setIsFollowLoading(true);

    if (!isFollowingBrand) {
      toast.info(`You are not following ${brandData?.raw_name}`, {
        richColors: true,
        duration: 3000,
      });
      setIsFollowLoading(false);

      return;
    }

    try {
      await unfollowBrand.mutateAsync({
        brand_id: brandData?.id!,
        user_id: user?.id,
      });

      toast.success(`You have unfollowed ${brandData?.raw_name}`, {
        richColors: true,
        duration: 3000,
      });

      /*const brandFollowers = brandData?.followers ?? [];
      const updatedBrandFollowers = brandFollowers.filter(
        (email) => email !== user?.primaryEmailAddress?.emailAddress,
      );

      const { data, error } = await supabase
        .from(DBTables.Brand)
        .update({
          followers: updatedBrandFollowers,
          followersCount: updatedBrandFollowers.length,
        })
        .eq("id", brandData?.id)
        .select();

      if (error) {
        // console.error("Error unfollowing brand", error);
        toast.error(`Unable to unfollow ${brandData?.raw_name}`, {
          richColors: true,
          duration: 3000,
        });
        setIsFollowLoading(false);
      }

      if (data) {
        toast.success(`You have unfollowed ${brandData?.raw_name}`, {
          richColors: true,
          duration: 3000,
        });
        setIsFollowLoading(false);
      }*/
    } catch (error) {
      // console.error("Error unfollowing brand", error);
      toast.error(`Unable to unfollow ${brandData?.raw_name}`, {
        richColors: true,
        duration: 3000,
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const actionsList =
    brandData?.owner_email === user?.primaryEmailAddress?.emailAddress
      ? [
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
            modal: (
              <EmbedFeedbacksGenerator
                apiKey={brandData?.user_api_key!}
                fullWidth={true}
              />
            ),
          },
          /*{
            text: "Share Feedback",
            description: "Embed Feedbacks to your App",
            modal: <ShareBrandModal />,
          },*/
        ]
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
          },
        ];

  return (
    <ListboxWrapper>
      {/*<ScrollShadow hideScrollBar>*/}
      <Listbox
        aria-label="Listbox menu with sections"
        className="flex flex-row flex-nowrap"
        emptyContent="No Categories"
        variant="flat"
      >
        <ListboxItem
          key={"mobileBrandProfile"}
          className={"md:hidden"}
          textValue="brandProfile"
        >
          {!isBrandDataSuccessful ? (
            <BrandNavSkeleton />
          ) : (
            <Card
              className="py-0 bg-default-50/80 dark:bg-default-50 shadow-none"
              isPressable={false}
            >
              <CardBody className="flex flex-row items-end gap-x-4 overflow-visible px-2">
                {brandData?.brand_image && (
                  <Image
                    alt="Card background"
                    className="object-contain lg:object-cover rounded-xl size-28 lg:size-72"
                    src={brandData && brandData?.brand_image}
                    // width={size.width <= E_DeviceWidth.phone ? 120 : 270}
                    // height={size.width <= E_DeviceWidth.phone ? 120 : 270}
                  />
                )}
                <div>
                  <Skeleton
                    className={"rounded-xl"}
                    isLoaded={isBrandDataSuccessful}
                  >
                    <h4 className="font-bold text-3xl leading-normal">
                      {brandData && brandData?.raw_name}
                    </h4>
                  </Skeleton>
                  <div className="flex items-center gap-1 py-1">
                    <DynamicText
                      data={brandData?.followers_count}
                      isLoaded={isBrandDataSuccessful}
                      textPlural="Followers"
                      textSingular="Follower"
                    />
                    <DotSpacer />
                    <DynamicText
                      data={brandData?.feedback_count}
                      isLoaded={isBrandDataSuccessful}
                      textPlural="Feedbacks"
                      textSingular="Feedback"
                    />
                  </div>
                  <Spacer y={2} />
                  {userLoaded && (
                    <div className={"px-0"}>
                      {user?.primaryEmailAddress?.emailAddress !==
                        brandData?.owner_email &&
                        (isFollowingBrand ? (
                          <Button
                            color={"danger"}
                            isLoading={isFollowLoading}
                            variant={"solid"}
                            onPress={handleUnFollowBrand}
                          >
                            Unfollow
                          </Button>
                        ) : (
                          <Button
                            color={"primary"}
                            isDisabled={
                              !user?.primaryEmailAddress?.emailAddress
                            }
                            isLoading={isFollowLoading}
                            onPress={handleFollowBrand}
                          >
                            Follow
                          </Button>
                        ))}
                    </div>
                  )}
                </div>
              </CardBody>
              <CardHeader>{brandData?.description}</CardHeader>
              {/*<CardHeader className="pb-0 px-4 flex-col max-sm:col-span-2 items-start">
                <Skeleton
                  className={"rounded-xl"}
                  isLoaded={isBrandDataSuccessful}
                >
                  <h4 className="font-bold text-3xl leading-normal">
                    {brandData && brandData?.raw_name}
                  </h4>
                </Skeleton>
                {brandData?.description}
                <div className="flex items-center gap-1 py-2">
                  <DynamicText
                    data={brandData?.followers_count}
                    isLoaded={isBrandDataSuccessful}
                    textPlural="Followers"
                    textSingular="Follower"
                  />
                  <DotSpacer />
                  <DynamicText
                    data={brandData?.feedback_count}
                    isLoaded={isBrandDataSuccessful}
                    textPlural="Feedbacks"
                    textSingular="Feedback"
                  />
                </div>
                <Spacer y={2} />
                {userLoaded && (
                  <div className={"px-0"}>
                    {user?.primaryEmailAddress?.emailAddress !==
                      brandData?.owner_email &&
                      (isFollowingBrand ? (
                        <Button
                          color={"danger"}
                          isLoading={isFollowLoading}
                          variant={"solid"}
                          onPress={handleUnFollowBrand}
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          color={"primary"}
                          isDisabled={!user?.primaryEmailAddress?.emailAddress}
                          isLoading={isFollowLoading}
                          onPress={handleFollowBrand}
                        >
                          Follow
                        </Button>
                      ))}
                  </div>
                )}
                <Spacer y={4} />
              </CardHeader>*/}
            </Card>
          )}
        </ListboxItem>
        <ListboxItem
          key={"brandProfile"}
          className={"max-md:hidden"}
          textValue="brandProfile"
        >
          {!isBrandDataSuccessful ? (
            <BrandNavSkeleton />
          ) : (
            <Card
              className="max-lg:grid max-sm:grid-cols-3 md:grid-cols-none max-sm:w-full py-0 bg-default-500/80 dark:bg-default-50 shadow-none"
              isPressable={false}
            >
              <CardBody className="flex flex-col justify-center items-center overflow-visible px-2">
                {brandData?.brand_image && (
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl size-32 md:size-72"
                    src={brandData && brandData?.brand_image}
                    // width={size.width <= E_DeviceWidth.phone ? 120 : 270}
                    // height={size.width <= E_DeviceWidth.phone ? 120 : 270}
                  />
                )}
              </CardBody>
              <CardHeader className="pb-0 px-4 flex-col max-md:col-span-2 items-start">
                {/* <p className="text-tiny uppercase font-bold">Brand Details</p> */}
                {/* <small className="text-default-500">12 Tracks</small> */}
                <Skeleton
                  className={"rounded-xl"}
                  isLoaded={isBrandDataSuccessful}
                >
                  <h4 className="font-bold text-3xl leading-normal">
                    {brandData && brandData?.raw_name}
                  </h4>
                </Skeleton>
                {brandData?.description}
                <div className="flex items-center gap-1 py-2">
                  <DynamicText
                    data={brandData?.followers_count}
                    isLoaded={isBrandDataSuccessful}
                    textPlural="Followers"
                    textSingular="Follower"
                  />
                  <DotSpacer />
                  <DynamicText
                    data={brandData?.feedback_count}
                    isLoaded={isBrandDataSuccessful}
                    textPlural="Feedbacks"
                    textSingular="Feedback"
                  />
                </div>
                <Spacer y={2} />
                {userLoaded && (
                  <div
                    className={"px-0"}
                    /*onPress={
                    !user?.email
                      ? () => toast("You need to login to follow a brand")
                      : () => {}
                  }*/
                  >
                    {user?.primaryEmailAddress?.emailAddress !==
                      brandData?.owner_email &&
                      (isFollowingBrand ? (
                        <Button
                          color={"danger"}
                          isLoading={isFollowLoading}
                          variant={"solid"}
                          onPress={handleUnFollowBrand}
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          color={"primary"}
                          isDisabled={!user?.primaryEmailAddress?.emailAddress}
                          isLoading={isFollowLoading}
                          onPress={handleFollowBrand}
                        >
                          Follow
                        </Button>
                      ))}
                  </div>
                )}
                {/*{myEventInvites?.length > 0 && (
                  <section className="space-y-3 w-full">
                    <Spacer y={4} />
                    <Divider />
                    <Spacer y={4} />
                    <Button
                      fullWidth
                      color="danger"
                      startContent={
                        <span className="font-bold">
                          {myEventInvites?.length}
                        </span>
                      }
                      variant="shadow"
                    >
                      {myEventInvites?.length > 1
                        ? "Pending Invites"
                        : "Pending Invite"}
                    </Button>
                     <div className="text-danger text-medium">
                      <span className="font-bold">
                        {myEventInvites?.length}{" "}
                      </span>
                      {myEventInvites?.length > 1
                        ? "Pending Invites"
                        : "Pending Invite"}
                    </div>
                  </section>
                )}*/}
                <Spacer y={4} />
              </CardHeader>
            </Card>
          )}
        </ListboxItem>
        <ListboxSection
          className="grow shrink-0 lg:space-y-4 px-2 lg:px-4"
          classNames={{
            base: "",
            group:
              "lg:space-y-4 max-sm:flex max-sm:flex-row max-sm:items-center",
            heading: "max-sm:hidden text-2xl font-bold lg:py-4",
          }}
          itemClasses={{
            base: "",
            wrapper: "",
          }}
          items={actionsList}
          title="Actions"
          // showDivider
        >
          {(eachAction) => (
            <ListboxItem
              key={eachAction.text.toLocaleLowerCase()}
              className={""}
              classNames={{ base: "max-sm:grow" }}
              // description={eachAction.description}
              textValue={eachAction.text}
            >
              <Skeleton
                className={"rounded-xl"}
                isLoaded={isBrandDataSuccessful && userLoaded}
              >
                {eachAction.modal}
              </Skeleton>
            </ListboxItem>
          )}
        </ListboxSection>
        <ListboxSection
          hidden
          showDivider
          className="grow shrink-0 space-y-4 px-4"
          classNames={{
            base: "",
            group: "space-y-4",
            heading: "text-base py-4",
          }}
          itemClasses={{
            base: "",
            wrapper: "",
          }}
          items={categoryList}
          title="Categories"
        >
          {(eachCategory) => (
            <ListboxItem
              key={eachCategory.name.toLowerCase()}
              className=""
              description={eachCategory.description}
            >
              {eachCategory.name}
            </ListboxItem>
          )}
        </ListboxSection>
        <ListboxSection hidden className="grow-0 shrink" title="Danger zone">
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
      {/*</ScrollShadow>*/}
    </ListboxWrapper>
  );
}
