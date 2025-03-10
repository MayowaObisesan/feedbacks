import { useState } from "react";
import { useWatchContractEvent } from "wagmi";

import { FEEDBACK_ADDRESS, FEEDBACKS_ABI } from "@/constant";

interface IContractEvent {
  eventName: string;
}

const useContractEvent = ({ eventName }: IContractEvent) => {
  const [log, setLog] = useState<any | null>();

  useWatchContractEvent({
    address: FEEDBACK_ADDRESS,
    abi: FEEDBACKS_ABI,
    eventName,
    onLogs(logs) {
      console.log("New logs!", logs);
      setLog(logs);
    },
  });

  return log;
};

export default useContractEvent;
