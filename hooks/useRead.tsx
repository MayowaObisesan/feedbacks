// HOOKS FOR READING THE CONTRACT

import { FEEDBACK_ADDRESS, FEEDBACKS_ABI } from "@/constant";
import { useCallback } from "react";
import { useReadContract } from "wagmi";

//[x] - you can change the name of the props here
export interface readProps {
  functionName: string;
  args?: Array<any>;
  account?: `0x${string}`;
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

export default useRead;
