// HOOKS FOR READING THE CONTRACT

import { Address } from "viem";
import { useReadContract } from "wagmi";

import {
  BRAND_ABI,
  BRAND_ADDRESS,
  EVENT_ABI,
  EVENT_ADDRESS,
  FEEDBACK_ADDRESS,
  FEEDBACKS_ABI,
  PRODUCT_ABI,
  PRODUCT_ADDRESS,
} from "@/constant";

//[x] - you can change the name of the props here
export interface readProps {
  functionName: string;
  args?: Array<any>;
  account?: Address;
}

//-[x] - you can change the name of custom hook function name
const useRead = ({ functionName, args, account }: readProps) => {
  const data = useReadContract({
    abi: FEEDBACKS_ABI,
    address: FEEDBACK_ADDRESS,
    functionName,
    args,
  });

  return data || [];
};

export const useBrandRead = ({ functionName, args, account }: readProps) => {
  const data = useReadContract({
    abi: BRAND_ABI,
    address: BRAND_ADDRESS,
    functionName,
    account: account,
    args,
  });

  return data || [];
};

export const useEventRead = ({ functionName, args, account }: readProps) => {
  const data = useReadContract({
    abi: EVENT_ABI,
    address: EVENT_ADDRESS,
    functionName,
    args,
    account: account,
  });

  return data || [];
};

export const useFeedbackRead = ({ functionName, args, account }: readProps) => {
  const data = useReadContract({
    abi: FEEDBACKS_ABI,
    address: FEEDBACK_ADDRESS,
    functionName,
    args,
    account: account,
  });

  return data || [];
};

export const useProductRead = ({ functionName, args, account }: readProps) => {
  const data = useReadContract({
    abi: PRODUCT_ABI,
    address: PRODUCT_ADDRESS,
    functionName,
    args,
    account: account,
  });

  return data || [];
};

export default useRead;
