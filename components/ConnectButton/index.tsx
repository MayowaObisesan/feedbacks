"use client";

import { Button } from "@nextui-org/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import { DisconnectIcon, HeartFilledIcon } from "../icons";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const baseStyle =
    "px-4 py-2 font-bold text-white rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0 focus:outline-none";

  if (isConnected)
    return (
      <Button
        onClick={() => disconnect()}
        color="danger"
        // className={`${baseStyle} bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600`}
        startContent={<DisconnectIcon />}
        variant="shadow"
      >
        {/* <span className="mr-2 text-xl">🔓</span> */}
        Logout
      </Button>
    );
  return (
    // <Button
    //   onClick={() => open()}
    //   //   className={`${baseStyle} bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600`}
    // >
    //   <span className="mr-1 text-xl">👛</span>
    //   Connect Wallet
    // </Button>
    <Button
      onClick={() => open()}
      className="text-sm font-normal text-default-600 bg-default-100"
      startContent={<HeartFilledIcon className="text-danger" />}
      variant="flat"
    >
      Connect Wallet
    </Button>
  );
}
