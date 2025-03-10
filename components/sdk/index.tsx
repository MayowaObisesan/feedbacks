import { toast } from "sonner";
import { Provider, SignInWithOAuthCredentials } from "@supabase/auth-js";
import { Button } from "@nextui-org/button";
import { Suspense, useEffect, useState } from "react";
import { type User as I_User } from "@supabase/supabase-js";
import { Input, Textarea } from "@nextui-org/input";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { verifyKey } from "@unkey/api";
import { useSearchParams } from "next/navigation";
import { User } from "@nextui-org/user";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

import { unkey } from "@/utils/unkey";
import { IBrands, IUser } from "@/types";
import { APIKEY_PREFIX, FEEDBACKS_URL } from "@/constant";
import { RatingTag } from "@/utils";
import RatingComponent from "@/components/RatingStars/RatingComponent";
import { LastUsed, useLastUsed } from "@/hooks/lastUsed";
import { DisconnectIcon, GithubIcon, Icons } from "@/components/icons";
import { DBTables } from "@/types/enums";
import { supabase } from "@/utils/supabase/supabase";
// import { useIsMobile } from "@nextui-org/use-is-mobile";

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

const feedbackSampleList = [
  "The course content was well-structured, and the instructor clearly had a deep understanding of Rust. I loved how practical examples were integrated throughout, which made the learning process smoother!",
  "The course covered all the key areas I was hoping for, but I felt that the pacing was a bit fast, especially during the concurrency section. It would be great to have a few more detailed breakdowns of complex topics.",
  "Great job overall! However, I think adding more quizzes or hands-on projects at the end of each module would really help solidify the knowledge and give students more confidence in applying what they've learned.",
  "The tutorial videos were clear and engaging. One suggestion would be to include more real-world case studies to show how Rust is used in production-level applications.",
  "The project was a good proof of concept. However, I noticed some inconsistencies in the documentation and code comments. Clarifying these areas could help future collaborators understand the project better.",
  "The design of the project is sleek and functional, but I believe it could be optimized for performance. Consider running some benchmarks or profiling the code to see where improvements can be made.",
  "Fantastic job on meeting the requirements! The code quality is excellent, and your attention to detail really shows. Adding some unit tests would take this project to the next level.",
  "The final product turned out great, and I was impressed by the innovative features you added. However, I think you could improve error handling in edge cases to make it even more robust.",
  "The new update has brought a lot of improvements! The user interface is smoother, and the features are more intuitive. However, I did experience a few crashes during use, so it might be worth investigating potential stability issues.",
  "This product has been a game-changer for me! It's easy to use and packed with features. My only suggestion would be to add more customization options for advanced users who want to tweak settings further.",
  "The product's functionality is top-notch, and I appreciate how seamlessly it integrates with my existing setup. That said, the customer support response times could be faster.",
  "I'm really happy with the product overall. It works exactly as described, and the installation was a breeze. One minor improvement could be offering a more detailed user manual for those less tech-savvy.",
  "The team worked well together and met the project deadline, which was fantastic. However, there were times when task ownership was unclear. Establishing clear roles upfront could help avoid confusion in the future.",
  "Great job on delivering such high-quality work under tight deadlines. One suggestion for improvement would be to schedule more regular check-ins to ensure everyone stays on track and issues can be addressed early.",
  "The collaboration between the different team members was impressive. I appreciated how everyone was proactive in solving problems. If we could document the decisions made during meetings, it would help keep track of progress more effectively.",
  "I'm really pleased with how the team handled the project. The communication was strong, and everyone contributed valuable insights. A small area for improvement would be speeding up response times on certain critical tasks.",
];

function getRandomFeedback(feedbackList: string[]) {
  const randomIndex = Math.floor(Math.random() * feedbackList.length);

  return feedbackList[randomIndex];
}

function FeedbacksFormContent({
  width,
  height,
  isPreview = true,
}: {
  width?: number;
  height?: number;
  isPreview: boolean;
}) {
  const searchParams = useSearchParams();
  // const searchParams = new URLSearchParams(window.location.search);

  const apiKey = APIKEY_PREFIX + searchParams.get("fdb") || ""; // returns 'bar' when ?foo=bar
  const theme = searchParams.get("theme") || "";
  const queryWidth = searchParams.get("width") || width || 400;
  const queryHeight = searchParams.get("height") || height || 720;

  // const isMobile = useIsMobile()
  const [lastUsed, setLastUsed] = useLastUsed();
  const [user, setUser] = useState<I_User>();
  const [userDB, setUserDB] = useState<IUser>();

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
  const [thisBrandData, setThisBrandData] = useState<IBrands>();

  // Apply theme styles dynamically
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user!);
      getUserDB(user!);
    };

    const getUserDB = async (userData: I_User) => {
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
    };

    const getBrand = async () => {
      const { data: brandData, error: brandError } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("userApiKey", apiKey);

      if (brandData && brandData.length > 0) {
        setThisBrandData(brandData[0]);
      }

      if (brandError) {
        // console.error("Unable to fetch brand data", brandError.message);
        toast.error("Unable to fetch brand data");
      }
    };

    getUser();
    getBrand();
  }, []);

  const handleSupabaseOauthSignIn = async (provider: Provider) => {
    setLastUsed(provider === "google" ? "google" : "github");

    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: "http://localhost:3000/home",
      },
    } as SignInWithOAuthCredentials);
  };

  const onCreateFeedback = async () => {
    setIsSubmitting(true);

    try {
      // get the brandId from the API-Key provided.
      if (thisBrandData) {
        const brandId = thisBrandData.id;
        const { data, error } = await supabase
          .from(DBTables.Feedback)
          .insert([
            {
              recipientId: brandId,
              title: feedbackTitle,
              email: user?.email,
              description: feedbackContent,
              eventId: null,
              productId: null,
              starRating: rating,
              fromEmbed: true,
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
        }

        if (data) {
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

        if (error) {
          // console.error("error creating feedback", error);
          toast.error("Error creating your feedback. Kindly try again.");
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      // console.error("Unable to submit feedback", error);
      toast.error("Error submitting feedback", {
        description:
          "An error occurred trying to submit feedback. Pls try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  if (!isPreview && !user) {
    return (
      <div
        className={
          "fixed top-0 left-0 right-0 flex flex-col justify-center items-center gap-8 h-dvh w-full"
        }
      >
        <div className={"text-xl font-bold"}>
          Continue with your Social Accounts
        </div>
        {/*<div>
        {JSON.stringify(sessionData, null, 2)}
      </div>*/}
        <div className={"flex flex-row justify-center items-center gap-3"}>
          {/*<Button
          variant="solid"
          type="button"
          // disabled={isLoading}
          onClick={() => handleOauthSignIn("github")}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          <GithubIcon />
          GitHub {lastUsed === "github" ? <LastUsed /> : null}
        </Button>
        <Button
          variant="solid"
          type="button"
          // disabled={isLoading}
          onClick={() => handleOauthSignIn("google")}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}

          <Icons.google className="mr-2 h-4 w-4" />
          Google {lastUsed === "google" ? <LastUsed /> : null}
        </Button>*/}

          <Button
            type="button"
            variant="solid"
            // disabled={isLoading}
            onClick={() => handleSupabaseOauthSignIn("github")}
          >
            <GithubIcon />
            GitHub {lastUsed === "github" ? <LastUsed /> : null}
          </Button>
          <Button
            type="button"
            variant="solid"
            // disabled={isLoading}
            onClick={() => handleSupabaseOauthSignIn("google")}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Google {lastUsed === "google" ? <LastUsed /> : null}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScrollShadow>
        <div
          className={"p-4 space-y-8"}
          style={{ width: `${queryWidth}px`, height: `${queryHeight}px` }}
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

          <div className={"flex flex-row justify-between items-center gap-x-2"}>
            <div className={""}>
              Send Feedback to
              <div className={"font-bold text-2xl"}>
                {thisBrandData?.rawName}
              </div>
            </div>
            <Dropdown isDisabled={isPreview} placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: userDB?.dp || user?.user_metadata.avatar_url,
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
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-medium text-xs text-default-400">
                    Signed in as
                  </p>
                  <div>
                    <div className="font-bold">
                      {user?.user_metadata.full_name}
                    </div>
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
          </div>

          <div className="form-container flex flex-col gap-y-6">
            <Input
              classNames={{
                input: "placeholder:text-default-300",
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
            <Textarea
              isRequired
              className=""
              classNames={{
                input: "placeholder:text-default-300",
              }}
              label="Your Feedback"
              labelPlacement="outside"
              maxRows={16}
              minRows={12}
              placeholder={`e.g., ${getRandomFeedback(feedbackSampleList)}`}
              readOnly={isPreview}
              value={feedbackContent}
              onValueChange={setFeedbackContent}
            />
            <div className="space-y-2">
              <div className="text-small">Set a Rating</div>
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

            <Button
              color="primary"
              isDisabled={!isPreview || feedbackContent === ""}
              isLoading={isSubmitting}
              onPress={onCreateFeedback}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

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
}: {
  width?: number;
  height?: number;
  isPreview: boolean;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbacksFormContent
        height={height}
        isPreview={isPreview}
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
