"use client";

import useRead from "@/hooks/useRead";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useIsFirstRender } from "@uidotdev/usehooks";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { IBrands, IEvents, IFeedbacks, IProfile } from "@/types";

interface IFeedbacksContext {
  myAddress: Address;
  allBrandsData: IBrands[];
  profileExist: boolean;
  myProfile: IProfile;
  isMyProfileFetching: boolean;
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
  isMyFeedbacksDataSuccessful: boolean;
}

interface FeedbacksProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

const FeedbacksContext = createContext<IFeedbacksContext | null>({
  myAddress: "0x",
  allBrandsData: [
    {
      brandId: 0,
      name: "",
      rawName: "",
      owner: "",
      feedbackCount: 0,
      createdAt: "",
      followersCount: 0,
    },
  ],
  profileExist: false,
  myProfile: {
    name: "",
    bio: "",
    email: "",
    profilePictureHash: "",
    creationTime: "",
    lastUpdated: "",
  },
  isMyProfileFetching: false,
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
  isMyFeedbacksDataSuccessful: false,
});

function reconstructMyProfile(myProfile: any) {
  if (myProfile) {
    return {
      name: myProfile[0],
      email: myProfile[1],
      bio: myProfile[2],
      profilePictureHash: myProfile[3],
    };
  } else {
    return {};
  }
}

const FeedbacksProvider: React.FC<FeedbacksProviderProps> = ({ children }) => {
  const { address: myAddress } = useAccount();
  const isFirstRender = useIsFirstRender();
  const { data: allBrandsData } = useRead({
    functionName: "getAllBrands",
    args: ["", "0x0000000000000000000000000000000000000000"],
  });

  const { data: profileExist } = useRead({
    functionName: "profileExists",
    args: [myAddress],
  });

  const { data: myProfile, isFetching: isMyProfileFetching } = useRead({
    functionName: "getProfile",
    args: [myAddress],
  });
  // const myProfile = reconstructMyProfile(_myProfile);

  const {
    data: myBrandCount,
    isFetching: isMyBrandCountFetching,
    isSuccess: isMyBrandCountSuccessful,
  } = useRead({
    functionName: "brandOwners",
    args: [myAddress],
  });

  const {
    data: myEventInvites,
    isFetching: isMyEventInvitesFetching,
    isStale: isMyEventInvitesStale,
    isSuccess: isMyEventInvitesSuccessful,
  } = useRead({
    functionName: "getInvitesForAddress",
    args: [myAddress],
  });

  const {
    data: myBrandFeedbacks,
    isFetching: isMyBrandFeedbacksFetching,
    isStale: isMyBrandFeedbacksStale,
    isSuccess: isMyBrandFeedbacksSuccessful,
  } = useRead({
    functionName: "brandFeedbacks",
    args: [myAddress],
  });

  const {
    data: multipleEventsInvitesData,
    isFetching: isMultipleInvitesDataFetching,
    isSuccess: isMultipleInvitesDataSuccessful,
  } = useRead({
    functionName: "getMultipleEvents",
    args: [myEventInvites],
  });

  const {
    data: myFeedbacksData,
    isFetching: isMyFeedbacksDataFetching,
    isSuccess: isMyFeedbacksDataSuccessful,
  } = useRead({
    functionName: "getAllFeedbacks",
    args: [myAddress, 0, 0, 0],
  });

  const getInvitesForAddress = useCallback(() => {}, []);

  useEffect(() => {}, [isFirstRender]);

  return (
    <FeedbacksContext.Provider
      value={{
        myAddress,
        allBrandsData,
        profileExist,
        myProfile,
        isMyProfileFetching,
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
        isMyFeedbacksDataSuccessful,
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
