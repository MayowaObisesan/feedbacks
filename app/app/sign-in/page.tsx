"use client";

import * as React from "react";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@heroui/button";

import { Icons } from "@/components/icons";
import { LastUsed, useLastUsed } from "@/hooks/lastUsed";

export default function OauthSignIn() {
  const { signIn } = useSignIn();
  const [lastUsed, setLastUsed] = useLastUsed();

  if (!signIn) return null;

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/app/sign-in/sso-callback",
        redirectUrlComplete: "/app",
      })
      .then((res: any) => {
        // console.log(res);
      })
      .catch((err: any) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        // console.log(err.errors);
        // console.error(err, null, 2);
      });
  };

  // Render a button for each supported OAuth provider
  // you want to add to your app. This example uses only Google.
  return (
    <div>
      <Button variant={"flat"} onPress={() => signInWith("oauth_google")}>
        <Icons.google className="mr-2 h-4 w-4" />
        Sign in with Google {lastUsed === "google" ? <LastUsed /> : null}
      </Button>
    </div>
  );
}
