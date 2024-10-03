import { SVGProps } from "react";
import { Address } from "viem";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
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
  brandId: number;
  name: string;
  rawName: string;
  owner: string;
  feedbackCount: number;
  createdAt: string;
  followersCount: number;
}

export interface IEvents {
  eventId: number;
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
  createdAt: number;
}

export interface IFeedbacks {
  feedbackId: number;
  feedbackText: string;
  timestamp: number;
  sender: Address;
  recipientId: number;
  eventId: number; // Optional, 0 if not related to an event
  productId: number; // Optional, 0 if not related to a product
}