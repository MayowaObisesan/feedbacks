import { SVGProps } from "react";
import { Address } from "viem";
import { User } from "@supabase/auth-js";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type IUser = {
  id: number;
  bio: string;
  createdAt: string;
  email: string;
  updatedAt: string;
  userId: string;
  userData: User;
  dp: string;
};

export type IProfile = {
  name: string;
  bio: string;
  email: string;
  profilePictureHash: string;
  creationTime: string;
  lastUpdated: string;
};

export interface IBrands {
  id: number;
  brandId?: number;
  name: string;
  rawName: string;
  description: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
  feedbackCount: number;
  followersCount: number;
  category: string;
  api?: string;
  userApiKey?: string;
  imageHash?: string;
  brandImage: string;
  followers: string[];
}

export interface ICreateEventBasicInfo {
  owner: Address;
  brandId: number;
  name: string;
  description: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  eventWebsite: string;
  eventRegistrationLink: string;
  brandIds: number[];
}

export interface ICreateEventOtherInfo {
  eventImageHash: string;
  tags: string; // comma separated string
}

export interface IEventBasicInfo {
  eventId: number;
  createEventBasicInfo: ICreateEventBasicInfo;
  createdAt: number;
  updatedAt: number;
}

export interface IEventOtherInfo {
  eventId: number;
  createEventOtherInfo: ICreateEventOtherInfo;
}

export interface IEvents {
  eventBasicInfo: IEventBasicInfo;
  eventOtherInfo: IEventOtherInfo;
}

export interface IFeedbacks {
  isLoaded?: any;
  feedbackId?: number;
  id: number;
  feedbackText?: string;
  title?: string;
  email: string;
  description: string;
  timestamp: number;
  sender: Address;
  recipientId: number;
  eventId: number; // Optional, 0 if not related to an event
  productId: number; // Optional, 0 if not related to a product
  starRating: number; // Optional, 0 if not related to a product
}

export interface IProduct {
  productId: number;
  owner: string;
  name: string;
  rawName: string;
  description: string;
  brandId: number;
  createdAt: number;
  updatedAt: number;
  imageHash: string;
}

export interface ITrendingBrandCard {
  name: string;
  rawName: string;
  feedbackCount: number;
  description: string;
  avatarUrl: string;
}

export interface IBrandCard {
  name: string;
  rawName: string;
  feedbackCount: number;
  description: string;
  avatarUrl: string;
}
