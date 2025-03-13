"use client";

import { Button } from "@nextui-org/button";
import { useSession } from "next-auth/react";
import { Provider, SignInWithOAuthCredentials } from "@supabase/auth-js";

import { LastUsed, useLastUsed } from "@/hooks/lastUsed";
import { GithubIcon, Icons } from "@/components/icons";
import { supabase } from "@/utils/supabase/supabase";

export default function UserAuthForm() {
  /*const [_, setDbUser] = useState<UserResponse["data"]>();
  const [oAuthResponse, setOAuthResponse] = useState<{
    url: string;
    provider: Provider;
  }>();*/
  const [lastUsed, setLastUsed] = useLastUsed();
  const { data: sessionData } = useSession();

  /*useEffect(() => {
    async function fetchData() {
      // const { data: userData, error } = await supabase.auth.getUser();
      const { data: userData, error } = await supabase.auth.getSession();

      if (error) {
        // console.error("Error fetching user data", error);
        toast.error("Error fetching user data");
      }
      if (userData) {
        setDbUser(userData);
        // console.log("User data", userData);
      }
    }

    if (oAuthResponse?.url) {
      fetchData();
    }
  }, [oAuthResponse]);*/

  /*const handleOauthSignIn = async (provider: string) => {
    setLastUsed(provider === "google" ? "google" : "github");
    await signIn(provider, { callbackUrl: "/home" });

    // Create a user from the signin session data
    const { data, error } = await supabase.auth.signUp({
      email: sessionData?.user?.email!,
      password: ""
    });

    if (error) {
      // console.error("Error creating user", error);
      toast.error("Unable to create user from session data");
    }

    if (data) {
      setDbUser(data);
      toast.success("User created successfully", { richColors: true });
      // console.log("User data", data);
    }
  };*/

  const handleSupabaseOauthSignIn = async (provider: Provider) => {
    setLastUsed(provider === "google" ? "google" : "github");

    const getURL = () => {
      let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        "http://localhost:3000/";

      // Make sure to include `https://` when not localhost.
      url = url.startsWith("http") ? url : `https://${url}`;
      // Make sure to include a trailing `/`.
      url = url.endsWith("/") ? url : `${url}/`;

      return url;
    };

    // @ts-ignore
    console.log("NEXT PUBLIC SITE URL::", process.env.NEXT_PUBLIC_SITE_URL);
    // @ts-ignore
    console.log("NEXT PUBLIC VERCEL URL::", process.env.NEXT_PUBLIC_VERCEL_URL);
    // @ts-ignore
    console.log("redirect URL::", getURL());

    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: getURL(),
      },
    } as SignInWithOAuthCredentials);
  };

  return (
    <div
      className={
        "fixed top-0 left-0 right-0 flex flex-col justify-center items-center gap-8 h-dvh w-full"
      }
    >
      <div>{sessionData && <div>Welcome {sessionData.user?.name}</div>}</div>
      <div className={"text-xl text-balance font-bold"}>
        Continue using your Social Accounts
      </div>
      {/*<div>
        {JSON.stringify(sessionData, null, 2)}
      </div>*/}
      <div className={"flex flex-row justify-center items-center gap-3"}>
        {/*<Button
          variant="solid"
          type="button"
          // disabled={isLoading}
          onClick={() => handleOauthSignIn("github")}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          <GithubIcon />
          GitHub {lastUsed === "github" ? <LastUsed /> : null}
        </Button>
        <Button
          variant="solid"
          type="button"
          // disabled={isLoading}
          onClick={() => handleOauthSignIn("google")}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}

          <Icons.google className="mr-2 h-4 w-4" />
          Google {lastUsed === "google" ? <LastUsed /> : null}
        </Button>*/}

        <Button
          type="button"
          variant="solid"
          // disabled={isLoading}
          onClick={() => handleSupabaseOauthSignIn("github")}
        >
          <GithubIcon />
          GitHub {lastUsed === "github" ? <LastUsed /> : null}
        </Button>
        <Button
          type="button"
          variant="solid"
          // disabled={isLoading}
          onClick={() => handleSupabaseOauthSignIn("google")}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google {lastUsed === "google" ? <LastUsed /> : null}
        </Button>
      </div>
    </div>
  );
}
