"use client";

import { Button } from "@nextui-org/button";
import { signIn, signOut, useSession } from "next-auth/react";

import { DisconnectIcon, HeartFilledIcon } from "../icons";

export default function ConnectButton() {
  const { data: session } = useSession();

  // const baseStyle =
  //   "px-4 py-2 font-bold text-white rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0 focus:outline-none";

  if (session)
    return (
      <Button
        color="danger"
        // className={`${baseStyle} bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600`}
        startContent={<DisconnectIcon />}
        variant="shadow"
        onPress={() => signOut()}
      >
        Logout
      </Button>
    );

  return (
    <Button
      className="text-sm font-normal text-default-600 bg-default-100"
      startContent={<HeartFilledIcon className="text-danger" />}
      variant="flat"
      onClick={() => signIn("google")}
    >
      Connect Wallet
    </Button>
  );
}
