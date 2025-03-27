"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useIsFirstRender } from "@uidotdev/usehooks";
import { Address } from "viem";
import { undefined } from "zod";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession, useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";

import { Brand, Feedback, IBrands, IUser } from "@/types";
import { DBTables } from "@/types/enums";
import { useRealTimeBrands } from "@/hooks/useBrands";
import { useRealTimeFeedbacks } from "@/hooks/useFeedbacks";
import { useRealTimeUsers } from "@/hooks/useFeedbackUser";

interface IFeedbacksContext {
  readonly supabaseClient: any;
  myAddress: Address;
  allBrandsData: Brand[] | undefined;
  trendingBrandsData: IBrands[] | undefined;
  userSessionData: any;
  updateSessionData: any;
  // user: UserResource | undefined;
  SetUser: any;
  userDB: IUser | undefined;
  mySentFeedbacksData: Feedback[] | undefined;
}

interface FeedbacksProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

const FeedbacksContext = createContext<IFeedbacksContext>({
  supabaseClient: null,
  SetUser: undefined,
  userDB: undefined as unknown as IUser,
  userSessionData: undefined,
  updateSessionData: undefined,
  mySentFeedbacksData: undefined as unknown as Feedback[],
  myAddress: "0x",
  allBrandsData: [] as Brand[],
  trendingBrandsData: undefined as unknown as IBrands[],
});

const FeedbacksProvider: React.FC<FeedbacksProviderProps> = ({ children }) => {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient>();
  // For the w2 version of Feedbacks
  const [userSessionData, setUserSessionData] = useState();
  // const [user, setUser] = useState<I_User>();
  const [userDB, setUserDB] = useState<IUser>();
  // const [allBrandsData, setAllBrandsData] = useState<Brand[]>([]);
  // const [trendingBrandsData, setTrendingBrandsData] = useState<IBrands[]>([]);
  // const [mySentFeedbacksData, setMySentFeedbacksData] = React.useState<
  //   Feedback[]
  // >([]);
  // const [profileExist, setProfileExist] = React.useState<boolean>(false);
  // const { address: myAddress } = useAccount();
  const isFirstRender = useIsFirstRender();

  // The `useUser()` hook will be used to ensure that Clerk has loaded data about the logged in user
  const { user } = useUser();
  // The `useSession()` hook will be used to get the Clerk session object
  const { session } = useSession();

  // Create a custom supabase client that injects the Clerk Supabase token into the request headers
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        global: {
          // Get the custom Supabase token from Clerk
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({
              template: "supabase",
            });

            // Insert the Clerk Supabase token into the headers
            const headers = new Headers(options?.headers);

            headers.set("Authorization", `Bearer ${clerkToken}`);

            // Now call the default fetch
            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      },
    );
  }

  // Create a `client` object for accessing Supabase data using the Clerk token
  const client = createClerkSupabaseClient();

  // Fetch all brands
  useEffect(() => {
    setSupabaseClient(client);

    // async function getAllBrands() {
    //   const { data: brands } = await client
    //     .from(DBTables.Brand)
    //     .select("*")
    //     .range(0, 10);
    //
    //   if (brands && brands.length > 0) {
    //     setAllBrandsData(brands);
    //   }
    // }
    //
    // getAllBrands();
    //
    // // Fetch trending brands
    // /*
    // // Criteria for Trending Brand
    // 1. The Brand which has the most feedback within a certain duration usually 5 minutes.
    //   i.e., the brand with the most feedback within the last 5 minutes.
    //       => This can be achieved by querying the feedback table and grouping by brandId and then sorting by count.
    // */
    // async function getTrendingBrands() {
    //   const { data: trendingBrands } = await client
    //     .from(DBTables.Brand)
    //     .select("*")
    //     .range(0, 10);
    //
    //   if (trendingBrands && trendingBrands.length > 0) {
    //     setTrendingBrandsData(trendingBrands);
    //   }
    // }
    //
    // getTrendingBrands();
    //
    // async function getMySentFeedbacks() {
    //   const { data, error } = await client
    //     .from(DBTables.Feedback)
    //     .select("*")
    //     .eq("email", user?.primaryEmailAddress?.emailAddress!)
    //     .order("created_at", { ascending: false })
    //     .range(0, 10);
    //
    //   if (error) {
    //     console.error("Error occurred when fetching userFeedbacks", error);
    //   }
    //
    //   if (data && data.length > 0) {
    //     setMySentFeedbacksData(data);
    //   }
    // }
    //
    // /*async function getProfile() {
    //   const { data, error } = await client
    //     .from(DBTables.User)
    //     .select("*")
    //     .eq("email", user?.primaryEmailAddress?.emailAddress);
    //
    //   if (error) {
    //     console.error("Unable to fetch userProfile", error);
    //   }
    //   if (data && data.length > 0) {
    //     setProfileExist(data[0]);
    //   }
    // }*/
    //
    // if (isSignedIn) {
    //   getMySentFeedbacks();
    //   // getProfile();
    // }
  }, [user]);

  /*const { data: allBrandsData } = useBrandRead({
    functionName: "getAllBrands",
    args: ["", "0x0000000000000000000000000000000000000000", ""],
  });*/

  // const { data: profileExist } = useBrandRead({
  //   functionName: "profileExists",
  //   args: [myAddress],
  // })

  /*const { data: myProfileData, isFetching: isMyProfileDataFetching } =
    useBrandRead({
      functionName: "getProfile",
      args: [myAddress],
    });
  // const myProfileData = reconstructMyProfile(_myProfile);*/

  /*const {
    data: myBrandCount,
    isFetching: isMyBrandCountFetching,
    isSuccess: isMyBrandCountSuccessful,
  } = useBrandRead({
    functionName: "brandOwners",
    args: [myAddress],
  });*/

  /*const {
    data: myEventInvites,
    isFetching: isMyEventInvitesFetching,
    isStale: isMyEventInvitesStale,
    isSuccess: isMyEventInvitesSuccessful,
  } = useEventRead({
    functionName: "getInvitesForAddress",
    args: [myAddress],
  });*/

  /*const {
    data: myBrandsData,
    isFetching: isMyBrandsDataFetching,
    isStale: isMyBrandsDataStale,
    isSuccess: isMyBrandsDataSuccessful,
  } = useBrandRead({
    functionName: "getMyBrands",
    args: [],
    account: myAddress,
  });*/

  /*const {
    data: myFollowedBrandsData,
    isFetching: isMyFollowedBrandsDataFetching,
    isStale: isMyFollowedBrandsDataStale,
    isSuccess: isMyFollowedBrandsDataSuccessful,
  } = useBrandRead({
    functionName: "getFollowedBrands",
    args: [myAddress],
  });*/

  /*const {
    data: myFollowedBrandsPaginatedData,
    isFetching: isMyFollowedBrandsPaginatedDataFetching,
    isStale: isMyFollowedBrandsPaginatedDataStale,
    isSuccess: isMyFollowedBrandsPaginatedDataSuccessful,
  } = useBrandRead({
    functionName: "getFollowedBrandsPaginatedForLoop",
    args: [myAddress, 1, 10],
  });*/

  /*const {
    data: myFeedbacksData,
    isFetching: isMyFeedbacksDataFetching,
    isStale: isMyFeedbacksDataStale,
    isSuccess: isMyFeedbacksDataSuccessful,
  } = useFeedbackRead({
    functionName: "getMyFeedbacks",
    args: [],
    account: myAddress,
  });*/

  /*const {
    data: myEventsData,
    isFetching: isMyEventsDataFetching,
    isStale: isMyEventsDataStale,
    isSuccess: isMyEventsDataSuccessful,
  } = useEventRead({
    functionName: "getMyEvents",
    args: [],
    account: myAddress,
  });*/

  /*const {
    data: multipleEventsInvitesData,
    isFetching: isMultipleInvitesDataFetching,
    isSuccess: isMultipleInvitesDataSuccessful,
  } = useEventRead({
    functionName: "getMultipleEvents",
    args: [[myEventInvites]],
  });*/

  /*const {
    data: allFeedbacksData,
    isFetching: isAllFeedbacksDataFetching,
    isStale: isAllFeedbacksDataStale,
    isSuccess: isAllFeedbacksDataSuccessful,
  } = useFeedbackRead({
    functionName: "getAllFeedbacks",
    args: [zeroAddress, 0, 0, 0],
  });*/

  const updateSessionData = useCallback((data: any) => {
    setUserSessionData(data);
  }, []);

  const SetUser = async (user: UserResource) => {
    // setUser(user);

    const { data, error } = await client
      .from(DBTables.User)
      .select("*")
      .eq("email", user?.primaryEmailAddress?.emailAddress);

    if (error) {
      throw new Error("Unable to fetch your profile");
    }

    if (data && data.length > 0) {
      setUserDB(data[0]);
    }
  };

  useEffect(() => {}, [isFirstRender]);

  return (
    <FeedbacksContext.Provider
      // @ts-ignore
      value={{
        supabaseClient,
        // myAddress,
        // allBrandsData,
        // trendingBrandsData,
        /*myProfileData,
        isMyProfileDataFetching,
        myEventInvites,
        isMyEventInvitesFetching,
        isMyEventInvitesStale,
        isMyEventInvitesSuccessful,
        myBrandCount,
        isMyBrandCountFetching,
        isMyBrandCountSuccessful,
        multipleEventsInvitesData,
        isMultipleInvitesDataFetching,
        isMultipleInvitesDataSuccessful,
        myFeedbacksData,
        isMyFeedbacksDataFetching,
        isMyFeedbacksDataStale,
        isMyFeedbacksDataSuccessful,
        myBrandsData,
        isMyBrandsDataFetching,
        isMyBrandsDataStale,
        isMyBrandsDataSuccessful,
        myFollowedBrandsData,
        isMyFollowedBrandsDataFetching,
        isMyFollowedBrandsDataStale,
        isMyFollowedBrandsDataSuccessful,
        myFollowedBrandsPaginatedData,
        isMyFollowedBrandsPaginatedDataFetching,
        isMyFollowedBrandsPaginatedDataStale,
        isMyFollowedBrandsPaginatedDataSuccessful,
        myEventsData,
        isMyEventsDataFetching,
        isMyEventsDataStale,
        isMyEventsDataSuccessful,
        allFeedbacksData,
        isAllFeedbacksDataFetching,
        isAllFeedbacksDataStale,
        isAllFeedbacksDataSuccessful,*/
        userSessionData,
        updateSessionData,
        SetUser,
        userDB,
        // mySentFeedbacksData,
      }}
    >
      {children}
    </FeedbacksContext.Provider>
  );
};

export const useFeedbacksContext = (): IFeedbacksContext => {
  const context = useContext(FeedbacksContext);

  if (!context) {
    throw new Error("FeedbacksContext must be used within a FeedbacksProvider");
  }

  return context;
};

export default FeedbacksProvider;
