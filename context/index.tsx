"use client";

import useRead, {
  useBrandRead,
  useEventRead,
  useFeedbackRead,
} from "@/hooks/useRead";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useIsFirstRender } from "@uidotdev/usehooks";
import { useAccount } from "wagmi";
import { Address, zeroAddress } from "viem";
import { IBrands, IEvents, IFeedbacks, IProfile } from "@/types";

interface IFeedbacksContext {
  myAddress: Address;
  allBrandsData: IBrands[];
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
      updatedAt: "",
      category: "",
      imageHash: "",
    },
  ],
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
  isMyEventsDataSuccessful: false,
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
  const { address: myAddress } = useAccount();
  const isFirstRender = useIsFirstRender();
  const { data: allBrandsData } = useBrandRead({
    functionName: "getAllBrands",
    args: ["", "0x0000000000000000000000000000000000000000", ""],
  });

  const { data: profileExist } = useBrandRead({
    functionName: "profileExists",
    args: [myAddress],
  });

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
  } = useRead({
    functionName: "getMultipleEvents",
    args: [myEventInvites],
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

  const getInvitesForAddress = useCallback(() => {}, []);

  useEffect(() => {}, [isFirstRender]);

  return (
    <FeedbacksContext.Provider
      value={{
        myAddress,
        allBrandsData,
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
