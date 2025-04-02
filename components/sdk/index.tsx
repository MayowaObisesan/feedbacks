"use client";

import { toast } from "sonner";
import { Button } from "@heroui/button";
import React, { Suspense, useEffect, useState } from "react";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { verifyKey } from "@unkey/api";
import { useSearchParams } from "next/navigation";
import { User } from "@heroui/user";
import { ScrollShadow } from "@heroui/scroll-shadow";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { LucideFileImage, LucideX } from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Image } from "@heroui/image";
import { cn } from "@heroui/theme";

import { unkey } from "@/utils/unkey";
import { Brand } from "@/types";
import { APIKEY_PREFIX, FEEDBACKS_URL } from "@/constant";
import { RatingTag } from "@/utils";
import RatingComponent from "@/components/RatingStars/RatingComponent";
import { DBTables } from "@/types/enums";
import { supabase } from "@/utils/supabase/supabase";
import { useUserAndUserDBQuery } from "@/hooks/useFeedbackUser";
import { GoogleLogo } from "@/components/icons/GoogleLogo";
import { useCreateFeedback } from "@/hooks/useFeedbacks";

// import { useIsMobile } from "@heroui/use-is-mobile";

/*export interface FeedbackInput {
  apiKey: string;
  hideTitle?: string;
  hideRating?: number; // Assuming rating is between 1-3
  screenshot?: number;
}

export interface FeedbackOutput {
  feedback: string;
  sentiment: string;
}*/

function FeedbacksFormContent({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  width,
  height,
  isPreview,
  showScreenshots,
  showTitle,
}: {
  width?: number;
  height?: number;
  isPreview: boolean;
  showScreenshots: boolean;
  showTitle: boolean;
}) {
  const searchParams = useSearchParams();
  // const searchParams = new URLSearchParams(window.location.search);

  const apiKey = APIKEY_PREFIX + searchParams.get("fdb") || ""; // returns 'bar' when ?foo=bar
  const theme = searchParams.get("theme") || "";
  // const queryWidth = searchParams.get("width") || width || 400;
  // const queryHeight = searchParams.get("height") || height || 720;
  // const queryWidth = searchParams.get("width") || width || 400;
  const queryHeight = searchParams.get("height") || height || 7;

  // const isMobile = useIsMobile()
  // const [lastUsed, setLastUsed] = useLastUsed();
  // const [user, setUser] = useState<I_User>();
  // const [userDB, setUserDB] = useState<IUser>();

  // Extract query parameters for customization
  // const params = new URLSearchParams(window.location.search);
  // const apiKey = APIKEY_PREFIX+params.get("fdb") || "";
  // const theme = params.get("theme") || "";
  // const width = params.get("width") || "400";
  // const height = params.get("height") || "500";

  // State for feedback form
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [rating, setRating] = useState("");
  const [rating, setRating] = useState<number | null>(2);
  const [feedbackTitle, setFeedbackTitle] = useState<string>("");
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [thisBrandData, setThisBrandData] = useState<Brand>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { user, isSignedIn } = useUser();
  // const { signIn } = useSignIn();
  const { data: userAndUserDB } = useUserAndUserDBQuery();
  const { userDB } = userAndUserDB || {};
  const createFeedback = useCreateFeedback();

  // components/sdk/index.tsx
  // Add this at the start of your FeedbacksFormContent component

  useEffect(() => {
    // Send height updates to parent
    const sendHeight = () => {
      window.parent.postMessage(
        {
          type: "resize",
          height: document.documentElement.scrollHeight,
        },
        "*",
      );
    };

    // Send initial height
    sendHeight();

    // Send height on content changes
    const observer = new ResizeObserver(sendHeight);

    observer.observe(document.documentElement);

    return () => observer.disconnect();
  }, []);

  // Apply theme styles dynamically
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    /*const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user!);
      getUserDB(user!);
    };*/

    /*const getUserDB = async (userData: I_User) => {
      const { data, error } = await supabase
        .from(DBTables.User)
        .select("*")
        .eq("email", userData?.email);

      if (error) {
        // console.error("Unable to fetch your profile");
        throw new Error("Unable to fetch your profile");
      }

      if (data && data.length > 0) {
        setUserDB(data[0]);
      }
    };*/

    const getBrand = async () => {
      const { data: brandData, error: brandError } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("user_api_key", apiKey);

      if (brandData && brandData.length > 0) {
        setThisBrandData(brandData[0]);
      }

      if (brandError) {
        // console.error("Unable to fetch brand data", brandError.message);
        toast.error("Unable to fetch brand data");
      }
    };

    // getUser();
    getBrand();
  }, []);

  // check that signin is available. i.e., not null nor not undefined
  /*if (!signIn) return null;
  const signInWith = (strategy: OAuthStrategy) => {
    return (
      signIn
        .authenticateWithRedirect({
          strategy,
          redirectUrl: "/app/sign-in/sso-callback",
          redirectUrlComplete: "/app",
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((res: any) => {
          // console.log(res);
          // setLastUsed("google");
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((err: any) => {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          // console.log(err.errors);
          // console.error(err, null, 2);
        })
    );
  };*/

  const resetForm = () => {
    setFeedbackTitle("");
    setFeedbackContent("");
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const onCreateFeedback = async () => {
    setIsSubmitting(true);

    const uploadScreenshots = async (files: File[]) => {
      try {
        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();

          formData.append("file", file);
          formData.append("upload_preset", "feedbacks_preset");

          try {
            const res = await fetch(
              process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!,
              {
                method: "POST",
                body: formData,
              },
            );

            if (!res.ok) {
              throw new Error(`Failed to upload ${file.name}`);
            }

            const data = await res.json();

            return data.secure_url;
          } catch (error) {
            toast.error(
              `Error uploading ${file.name}: ${(error as any).message}`,
            );
            throw error;
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        toast.success("Screenshots uploaded successfully");

        return uploadedUrls;
      } catch (error) {
        toast.error("Error uploading screenshots");
        throw error;
      }
    };

    try {
      // get the brandId from the API-Key provided.
      if (thisBrandData) {
        const brandId = thisBrandData.id;
        const screenshotUrls =
          selectedImages.length > 0
            ? await uploadScreenshots(selectedImages)
            : [];

        // @ts-ignore
        const response = await createFeedback.mutateAsync({
          recipient_id: brandId!,
          title: feedbackTitle.trim(),
          email: user?.primaryEmailAddress?.emailAddress!,
          description: feedbackContent.trim(),
          event_id: null,
          product_id: null,
          star_rating: rating,
          // be_anonymous: beAnonymous,
          screenshots: screenshotUrls.join(","),
        });

        if (response) {
          // onClose();
          toast.success("Feedback created successfully.");
          resetForm();
        }

        /*const { data, error } = await supabase
          .from(DBTables.Feedback)
          .insert([
            {
              recipient_id: brandId,
              title: feedbackTitle,
              email: user?.primaryEmailAddress?.emailAddress,
              description: feedbackContent,
              event_id: null,
              product_id: null,
              star_rating: rating,
              from_embed: true,
            },
          ])
          .select();

        // const {data: brand, error: brandError} = await supabase
        //   .from(DBTables.Brand)
        //   .select("*")
        //   .eq('id', brandId);

        const { count } = await supabase
          .from(DBTables.Feedback)
          .select("*", { count: "exact", head: true })
          .eq("recipientId", brandId);

        // Update the brands parameters also.
        if (count! > 0) {
          await supabase
            .from(DBTables.Brand)
            .update({
              feedbackCount: count,
            })
            .eq("id", brandId);
        }*/

        if (response) {
          toast.success("Feedback created successfully.");

          // Verify the apiKey after the feedback is sent,
          // so we can keep track of the remaining times the apiKey can be used.
          // Get the apiKey first.
          const { result, error } = await unkey.keys.get({ keyId: apiKey });

          if (error) {
            // console.error(error.message);
            return;
          }

          const { result: verifyResult, error: verifyError } = await verifyKey({
            key: apiKey,
            apiId: result?.apiId,
          });

          if (verifyError) {
            // handle potential network or bad request error
            // a link to our docs will be in the `error.docs` field
            // console.error(verifyError.message);

            return;
          }

          if (!verifyResult?.valid) {
            // do not grant access
            return;
          }

          // process request
          // console.log("Feedback sent and verified successfully", verifyResult);
        }

        /*if (error) {
          // console.error("error creating feedback", error);
          toast.error("Error creating your feedback. Kindly try again.");
        }*/
      }
    } catch (error) {
      setIsSubmitting(false);
      // console.error("Unable to submit feedback", error);
      toast.error("Error submitting feedback", {
        description: "We were unable to submit your feedback. Pls try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddScreenshots = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";

    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);

      // Check number of files
      if (files.length + selectedImages.length > 2) {
        toast.error("Maximum 2 images allowed");

        return;
      }

      // Validate each file
      const validFiles = files.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit`);

          return false;
        }
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);

          return false;
        }

        return true;
      });

      // Create preview URLs and update state
      validFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });

      setSelectedImages((prev) => [...prev, ...validFiles]);
    };

    input.click();
  };

  if (!apiKey) {
    return (
      <section>
        <Card className="max-w-[400px]">
          {/*<CardHeader className="flex gap-3">
            <Image
              alt="heroui logo"
              height={40}
              radius="sm"
              src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md"></p>
              <p className="text-small text-default-500">heroui.com</p>
            </div>
          </CardHeader>*/}
          <CardBody>
            <div>
              Hey 👋, we are unable to display the feedback UI.
              <br /> <br />
              Please drop a feedback for the brand from our official Website
              using the link below.
              <br /> <br />
              Just search for this brand name and drop them a feedback. We will
              appreciate that.
            </div>
          </CardBody>
          <Divider />
          <CardFooter>
            <Link isExternal showAnchorIcon href={FEEDBACKS_URL}>
              Feedbacks website
            </Link>
          </CardFooter>
        </Card>
      </section>
    );
  }

  /*if (!isPreview && !user) {
    return (
      <section
        className={
          "relative flex flex-col justify-center items-center gap-y-4 h-dvh w-full"
        }
      >
        <div className={"absolute top-8 py-2"}>
          <div className={"flex flex-col items-center gap-x-1"}>
            <FeedbacksLogo size={32} />
            <p className="font-bold text-inherit">Welcome to Feedbacks</p>
          </div>
          {/!*<div className={"text-lg text-balance"}>
          <span className={"text-small font-semibold"}>Sign in using your</span>
          <span className={"font-medium"}>Social Accounts</span>
        </div>*!/}
        </div>
        <div className={"flex flex-row justify-center items-center gap-3"}>
          <Button
            className={"font-semibold"}
            size={"md"}
            variant={"flat"}
            onPress={() => signInWith("oauth_google")}
          >
            <GoogleLogo size={16} />
            Sign in with Google
            {/!*{lastUsed === "google" ? <LastUsed /> : null}*!/}
          </Button>
        </div>
      </section>
    );
  }*/

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScrollShadow>
        <div
          className={"p-4 space-y-8 rounded-2xl"}
          // style={{ width: `${queryWidth}px`, height: `${queryHeight}px` }}
        >
          {/*<User
          avatarProps={{
            src: user?.user_metadata?.avatar_url,
          }}
          description={
            <Link isExternal href="https://x.com/jrgarciadev" size="sm">
              @{user?.email}
            </Link>
          }
          name={user?.user_metadata?.full_name}
        />*/}

          {/* @ts-ignore */}
          <SignedOut>
            <Card className={"sticky top-0"}>
              <CardBody>
                <div className={"flex flex-col gap-2"}>
                  <div className={"text-center text-default-400"}>
                    Kindly sign in to send your feedback.
                    <br />
                    It&apos;ll take less than a minute.
                  </div>
                  <Button
                    as={Link}
                    className={"font-semibold"}
                    href={"/sign-in"}
                    size={"md"}
                    target={"_blank"}
                    variant={"flat"}
                    // onPress={() => signInWith("oauth_google")}
                  >
                    <GoogleLogo size={16} />
                    Sign in with Google
                    {/*{lastUsed === "google" ? <LastUsed /> : null}*/}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </SignedOut>
          <div className={"flex flex-row justify-between items-center gap-x-2"}>
            <div className={""}>
              Send Feedback to
              <div className={"font-bold text-2xl"}>
                {thisBrandData?.raw_name}
              </div>
            </div>
            <Dropdown isDisabled={isPreview} placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: userDB?.dp || user?.imageUrl,
                  }}
                  className="transition-transform"
                  description={""}
                  name={""}
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User Actions"
                classNames={{
                  list: "gap-y-2",
                }}
                variant="flat"
              >
                <DropdownItem
                  key="profile"
                  className={cn(!isSignedIn ? "hidden" : "h-14 gap-2")}
                >
                  <p className="font-medium text-xs text-default-400">
                    Signed in as
                  </p>
                  <div>
                    <div className="font-bold">{user?.fullName}</div>
                    <div className="text-sm text-default-500 overflow-ellipsis overflow-x-hidden whitespace-nowrap">
                      ({userDB?.email})
                    </div>
                  </div>
                </DropdownItem>
                <DropdownItem key="system">
                  <Link
                    isExternal
                    showAnchorIcon
                    className={"text-sm"}
                    href={FEEDBACKS_URL}
                  >
                    Visit Feedbacks app
                  </Link>
                </DropdownItem>
                {/*<DropdownItem
                  key="signout"
                  as={Button}
                  className={cn(!isSignedIn ? "hidden" : "text-left")}
                  color="danger"
                  endContent={<DisconnectIcon size={20} strokeWidth={4} />}
                  variant={"light"}
                  onPress={handleSignOut}
                >
                  Log Out
                </DropdownItem>*/}
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="form-container flex flex-col gap-y-6">
            {showTitle && (
              <Input
                classNames={{
                  input: "placeholder:text-default-300",
                  label: "font-semibold",
                }}
                label="Title"
                labelPlacement="outside"
                name="title"
                placeholder="Your Feedback title"
                readOnly={isPreview}
                size={"lg"}
                type="text"
                value={feedbackTitle}
                onValueChange={setFeedbackTitle}
              />
            )}
            <Textarea
              isRequired
              className=""
              classNames={{
                input: "placeholder:text-default-300",
                label: "font-semibold",
              }}
              disableAutosize={true}
              label="Your Feedback"
              labelPlacement="outside"
              // maxRows={16}
              // minRows={12}
              // minRows={16}
              // rows={Math.round(Number(queryHeight) / 60)} // 60 is the default height of a textarea row
              placeholder={
                "Write your feedback content here. Express yourself."
              }
              readOnly={isPreview}
              rows={Number(queryHeight)}
              value={feedbackContent}
              onValueChange={setFeedbackContent}
            />
            <div className="space-y-2">
              <div className="font-semibold text-small">Set a Rating</div>
              {/* <Rating setRating={setRating} /> */}
              <RatingComponent
                selectedRating={rating!}
                setSelectedRating={setRating}
              />
            </div>
            {rating! > 0 ? (
              <div className="font-bold text-warning">{RatingTag(rating!)}</div>
            ) : (
              <div>No rating selected</div>
            )}

            <div className={""}>
              {imagePreviews.length > 0 && (
                <div className="flex gap-3 px-4 py-2 overflow-x-auto">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-16 h-16 ">
                      <Image
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                        height={"64px"}
                        src={preview}
                        width={"64px"}
                      />
                      <Button
                        isIconOnly
                        className="absolute -top-2 -right-2 z-10 bg-danger-500 text-white rounded-full flex items-center justify-center"
                        size={"sm"}
                        onPress={() => {
                          setImagePreviews((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                          setSelectedImages((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
                      >
                        <LucideX size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {imagePreviews.length > 0 && <Divider className={"my-2"} />}
            </div>

            <div
              className={"flex flex-row justify-between items-center w-full"}
            >
              {showScreenshots && (
                <Button
                  isDisabled={imagePreviews.length === 2}
                  variant={"flat"}
                  onPress={handleAddScreenshots}
                >
                  <span className={"flex flex-row gap-x-2 text-small"}>
                    <LucideFileImage size={20} />
                    Add Screenshots
                  </span>
                </Button>
              )}
              {/* @ts-ignore */}
              <SignedIn>
                <Button
                  color="primary"
                  fullWidth={!showScreenshots}
                  isDisabled={!isPreview && feedbackContent === ""}
                  isLoading={isSubmitting}
                  onPress={onCreateFeedback}
                >
                  Submit
                </Button>
              </SignedIn>
              {/* @ts-ignore */}
              <SignedOut>
                <Button isDisabled color="primary" fullWidth={!showScreenshots}>
                  Sign in to submit
                </Button>
              </SignedOut>
            </div>

            {/*<Button
              color="primary"
              isDisabled={!isPreview || feedbackContent === ""}
              isLoading={isSubmitting}
              onPress={onCreateFeedback}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>*/}

            {/*<h2>Feedback Form</h2>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"
                    required />
          <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5"
                 placeholder="Rating (1-5)" required />
          <button onClick={onCreateFeedback}>Submit</button>*/}
          </div>
        </div>
      </ScrollShadow>
    </Suspense>
  );
}

export default function FeedbacksForm({
  width,
  height,
  isPreview = true,
  showScreenshots = true,
  showTitle = true,
}: {
  width?: number;
  height?: number;
  isPreview: boolean;
  showScreenshots?: boolean;
  showTitle?: boolean;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbacksFormContent
        height={height}
        isPreview={isPreview}
        showScreenshots={showScreenshots}
        showTitle={showTitle}
        width={width}
      />
    </Suspense>
  );
}

/*
export class FeedbackSDK {
  static generateFeedback(input: FeedbackInput): FeedbackOutput {
    const { title, description, rating } = input;

    let sentiment: string;
    if (rating >= 4) {
      sentiment = "positive";
    } else if (rating >= 2) {
      sentiment = "neutral";
    } else {
      sentiment = "negative";
    }

    const feedback = `Feedback on "${title}": ${description}. Overall sentiment: ${sentiment}.`;

    return { feedback, sentiment };
  }
}
*/
