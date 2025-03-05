import { FEEDBACK_ADDRESS, FEEDBACKS_ABI } from "@/constant";
import { Abi, Address } from "viem";
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

//[x] - you can change the name of the props here
export interface addProps {
  contractAddress: Address;
  contractAbi: Abi;
  functionName: string;
  args?: Array<any>;
  value?: bigint;
}

//-[x] - you can change the name of custom hook function name
const useWrite = ({
  contractAddress,
  contractAbi,
  functionName,
  args,
  value,
}: addProps) => {
  const { data } = useSimulateContract({
    abi: contractAbi,
    address: contractAddress,
    functionName,
    args,
  });

  //[x] - you can change the name to your choice
  const {
    data: writeData,
    isPending: writeLoading,
    writeContract,
  } = useWriteContract();

  console.log("write data", writeData, data);
  // writeContract(data!.request);
  writeContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "createProduct",
    args: args,
  });

  //[x] - example how to use is on Button in React
  // <button disabled={isPending} type="submit">
  //   Mint
  //   {isPending ? "Confirming..." : "Mint"}
  // </button>;

  const {
    isError: writeWaitError,
    isSuccess: writeWaitSuccess,
    isLoading: writeWaitLoading,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return {
    writeData,
    writeLoading,
    writeContract,
    writeWaitError,
    writeWaitSuccess,
    writeWaitLoading,
  };
};

export default useWrite;
