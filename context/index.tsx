"use client";

import useRead, {
  useBrandRead,
  useEventRead,
  useFeedbackRead,
} from "@/hooks/useRead";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useIsFirstRender } from "@uidotdev/usehooks";
import { useAccount } from "wagmi";
import { Address, zeroAddress } from "viem";
import { IBrands, IEvents, IFeedbacks, IProfile, IUser } from "@/types";
import { undefined } from "zod";
import { supabase } from "@/utils/supabase/supabase";
import { type User as I_User } from "@supabase/supabase-js";
import { DBTables } from "@/types/enums";

interface IFeedbacksContext {
  myAddress: Address;
  allBrandsData: IBrands[] | undefined;
  trendingBrandsData: IBrands[] | undefined;
  profileExist: boolean;
  myProfileData: IProfile;
  isMyProfileDataFetching: boolean;
  myEventInvites: number[];
  isMyEventInvitesFetching: boolean;
  isMyEventInvitesStale: boolean;
  isMyEventInvitesSuccessful: boolean;
  myBrandCount: number;
  isMyBrandCountFetching: boolean;
  isMyBrandCountSuccessful: boolean;
  multipleEventsInvitesData: IEvents[];
  isMultipleInvitesDataFetching: boolean;
  isMultipleInvitesDataSuccessful: boolean;
  myFeedbacksData: IFeedbacks[];
  isMyFeedbacksDataFetching: boolean;
  isMyFeedbacksDataStale: boolean;
  isMyFeedbacksDataSuccessful: boolean;
  allFeedbacksData: IFeedbacks[];
  isAllFeedbacksDataFetching: boolean;
  isAllFeedbacksDataStale: boolean;
  isAllFeedbacksDataSuccessful: boolean;
  myBrandsData: IBrands[];
  isMyBrandsDataFetching: boolean;
  isMyBrandsDataStale: boolean;
  isMyBrandsDataSuccessful: boolean;
  myFollowedBrandsData: IBrands[];
  isMyFollowedBrandsDataFetching: boolean;
  isMyFollowedBrandsDataStale: boolean;
  isMyFollowedBrandsDataSuccessful: boolean;
  myFollowedBrandsPaginatedData: IBrands[];
  isMyFollowedBrandsPaginatedDataFetching: boolean;
  isMyFollowedBrandsPaginatedDataStale: boolean;
  isMyFollowedBrandsPaginatedDataSuccessful: boolean;
  myEventsData: IEvents[];
  isMyEventsDataFetching: boolean;
  isMyEventsDataStale: boolean;
  isMyEventsDataSuccessful: boolean;
  userSessionData: any;
  updateSessionData: any;
  user: I_User | undefined;
  SetUser: any;
  userDB: IUser | undefined;
  mySentFeedbacksData: IFeedbacks[] | undefined;
}

interface FeedbacksProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

const FeedbacksContext = createContext<IFeedbacksContext>({
  user: undefined as unknown as I_User,
  SetUser: undefined,
  userDB: undefined as unknown as IUser,
  userSessionData: undefined,
  updateSessionData: undefined,
  mySentFeedbacksData: undefined as unknown as IFeedbacks[],
  myAddress: "0x",
  allBrandsData: [
    {
      id: 0,
      name: "",
      rawName: "",
      ownerEmail: "",
      feedbackCount: 0,
      createdAt: "",
      followersCount: 0,
      brandImage: "",
      api: "",
      description: "",
      userApiKey: "",
      updatedAt: "",
      category: "",
      imageHash: "",
      brandId: 0,
      followers: [""]
    },
  ],
  trendingBrandsData: undefined as unknown as IBrands[],
  profileExist: false,
  myProfileData: {
    name: "",
    bio: "",
    email: "",
    profilePictureHash: "",
    creationTime: "",
    lastUpdated: "",
  },
  isMyProfileDataFetching: false,
  myEventInvites: [],
  isMyEventInvitesFetching: false,
  isMyEventInvitesStale: false,
  isMyEventInvitesSuccessful: false,
  myBrandCount: 0,
  isMyBrandCountFetching: true,
  isMyBrandCountSuccessful: false,
  multipleEventsInvitesData: [],
  isMultipleInvitesDataFetching: false,
  isMultipleInvitesDataSuccessful: false,
  myFeedbacksData: [],
  isMyFeedbacksDataFetching: false,
  isMyFeedbacksDataStale: false,
  isMyFeedbacksDataSuccessful: false,
  allFeedbacksData: [],
  isAllFeedbacksDataFetching: false,
  isAllFeedbacksDataStale: false,
  isAllFeedbacksDataSuccessful: false,
  myBrandsData: [],
  isMyBrandsDataFetching: false,
  isMyBrandsDataStale: false,
  isMyBrandsDataSuccessful: false,
  myFollowedBrandsData: [],
  isMyFollowedBrandsDataFetching: false,
  isMyFollowedBrandsDataStale: false,
  isMyFollowedBrandsDataSuccessful: false,
  myFollowedBrandsPaginatedData: [],
  isMyFollowedBrandsPaginatedDataFetching: false,
  isMyFollowedBrandsPaginatedDataStale: false,
  isMyFollowedBrandsPaginatedDataSuccessful: false,
  myEventsData: [],
  isMyEventsDataFetching: false,
  isMyEventsDataStale: false,
  isMyEventsDataSuccessful: false
});

function reconstructMyProfile(myProfileData: any) {
  if (myProfileData) {
    return {
      name: myProfileData[0],
      email: myProfileData[1],
      bio: myProfileData[2],
      profilePictureHash: myProfileData[3],
    };
  } else {
    return {};
  }
}

const FeedbacksProvider: React.FC<FeedbacksProviderProps> = ({ children }) => {
  // For the w2 version of Feedbacks
  const [userSessionData, setUserSessionData] = useState()
  const [user, setUser] = useState<I_User>();
  const [userDB, setUserDB] = useState<IUser>();
  const [allBrandsData, setAllBrandsData] = useState<IBrands[]>([]);
  const [trendingBrandsData, setTrendingBrandsData] = useState<IBrands[]>([]);
  const [mySentFeedbacksData, setMySentFeedbacksData] = React.useState<IFeedbacks[]>([]);
  const [profileExist, setProfileExist] = React.useState<boolean>(false);

  const { address: myAddress } = useAccount();
  const isFirstRender = useIsFirstRender();

  // Fetch all brands
  useEffect(() => {
    async function getAllBrands() {
      const {data: brands} = await supabase.from(DBTables.Brand).select('*').range(0, 10);

      if (brands && brands.length > 0) {
        setAllBrandsData(brands)
      }
    }

    getAllBrands();

    // Fetch trending brands
    /*
    // Criteria for Trending Brand
    1. The Brand which has the most feedback within a certain duration usually 5 minutes.
      i.e., the brand with the most feedback within the last 5 minutes.
          => This can be achieved by querying the feedback table and grouping by brandId and then sorting by count.
    */
    async function getTrendingBrands() {
      const {data: trendingBrands} = await supabase.from(DBTables.Brand).select('*').range(0, 10);
      if (trendingBrands && trendingBrands.length > 0) {
        setTrendingBrandsData(trendingBrands)
      }
    }
    getTrendingBrands()

    async function getMySentFeedbacks() {
      const {data, error} = await supabase
        .from(DBTables.Feedback)
        .select("*")
        .eq('email', user?.email!)
        .range(0, 10);

      if (error) {
        console.error("Error occurred when fetching userFeedbacks", error)
      }

      if (data && data.length > 0) {
        setMySentFeedbacksData(data);
      }
    }
    getMySentFeedbacks()

    async function getProfile() {
      const {data, error} = await supabase
        .from(DBTables.User)
        .select("*")
        .eq('email', user?.email);

      if (error) {
        console.error("Unable to fetch userProfile", error)
      }
      if (data && data.length > 0) {
        setProfileExist(data[0])
      }
    }
    getProfile()
  }, [user]);

  /*const { data: allBrandsData } = useBrandRead({
    functionName: "getAllBrands",
    args: ["", "0x0000000000000000000000000000000000000000", ""],
  });*/

  // const { data: profileExist } = useBrandRead({
  //   functionName: "profileExists",
  //   args: [myAddress],
  // })

  const { data: myProfileData, isFetching: isMyProfileDataFetching } =
    useBrandRead({
      functionName: "getProfile",
      args: [myAddress],
    });
  // const myProfileData = reconstructMyProfile(_myProfile);

  const {
    data: myBrandCount,
    isFetching: isMyBrandCountFetching,
    isSuccess: isMyBrandCountSuccessful,
  } = useBrandRead({
    functionName: "brandOwners",
    args: [myAddress],
  });

  const {
    data: myEventInvites,
    isFetching: isMyEventInvitesFetching,
    isStale: isMyEventInvitesStale,
    isSuccess: isMyEventInvitesSuccessful,
  } = useEventRead({
    functionName: "getInvitesForAddress",
    args: [myAddress],
  });

  const {
    data: myBrandsData,
    isFetching: isMyBrandsDataFetching,
    isStale: isMyBrandsDataStale,
    isSuccess: isMyBrandsDataSuccessful,
  } = useBrandRead({
    functionName: "getMyBrands",
    args: [],
    account: myAddress,
  });

  const {
    data: myFollowedBrandsData,
    isFetching: isMyFollowedBrandsDataFetching,
    isStale: isMyFollowedBrandsDataStale,
    isSuccess: isMyFollowedBrandsDataSuccessful,
  } = useBrandRead({
    functionName: "getFollowedBrands",
    args: [myAddress],
  });

  const {
    data: myFollowedBrandsPaginatedData,
    isFetching: isMyFollowedBrandsPaginatedDataFetching,
    isStale: isMyFollowedBrandsPaginatedDataStale,
    isSuccess: isMyFollowedBrandsPaginatedDataSuccessful,
  } = useBrandRead({
    functionName: "getFollowedBrandsPaginatedForLoop",
    args: [myAddress, 1, 10],
  });

  const {
    data: myFeedbacksData,
    isFetching: isMyFeedbacksDataFetching,
    isStale: isMyFeedbacksDataStale,
    isSuccess: isMyFeedbacksDataSuccessful,
  } = useFeedbackRead({
    functionName: "getMyFeedbacks",
    args: [],
    account: myAddress,
  });

  const {
    data: myEventsData,
    isFetching: isMyEventsDataFetching,
    isStale: isMyEventsDataStale,
    isSuccess: isMyEventsDataSuccessful,
  } = useEventRead({
    functionName: "getMyEvents",
    args: [],
    account: myAddress,
  });

  const {
    data: multipleEventsInvitesData,
    isFetching: isMultipleInvitesDataFetching,
    isSuccess: isMultipleInvitesDataSuccessful,
  } = useEventRead({
    functionName: "getMultipleEvents",
    args: [[myEventInvites]],
  });

  const {
    data: allFeedbacksData,
    isFetching: isAllFeedbacksDataFetching,
    isStale: isAllFeedbacksDataStale,
    isSuccess: isAllFeedbacksDataSuccessful,
  } = useFeedbackRead({
    functionName: "getAllFeedbacks",
    args: [zeroAddress, 0, 0, 0],
  });

  const updateSessionData = useCallback((data: any) => {
    setUserSessionData(data);
  }, []);

  const SetUser = async (user: I_User) => {
    setUser(user)

    const {data, error} = await supabase
      .from(DBTables.User)
      .select("*")
      .eq("email", user?.email);

    if (error) {
      throw new Error("Unable to fetch your profile");
    }

    if (data && data.length > 0) {
      setUserDB(data[0])
    }
  }

  const getInvitesForAddress = useCallback(() => { }, []);

  useEffect(() => { }, [isFirstRender]);

  return (
    <FeedbacksContext.Provider
      value={{
        myAddress,
        allBrandsData,
        trendingBrandsData,
        profileExist,
        myProfileData,
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
        isAllFeedbacksDataSuccessful,
        userSessionData,
        updateSessionData,
        user,
        SetUser,
        userDB,
        mySentFeedbacksData,
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
