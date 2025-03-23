import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function Page() {
  // Handle the redirect flow by calling the Clerk.handleRedirectCallback() method
  // or rendering the prebuilt <AuthenticateWithRedirectCallback/> component.
  // This is the final step in the custom OAuth flow.
  return <AuthenticateWithRedirectCallback />;
}

// "use client";
//
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useClerk } from "@clerk/nextjs";
//
// export default function SSOCallback() {
//   const router = useRouter();
//   const { handleRedirectCallback } = useClerk();
//
//   useEffect(() => {
//     // Handle the OAuth callback
//     const handleCallback = async () => {
//       try {
//         await handleRedirectCallback({
//           signInFallbackRedirectUrl: "/app",
//           // afterSignInUrl: "/app", // Redirect after successful sign in
//           // afterSignUpUrl: "/app", // Redirect after successful sign up
//         });
//         console.log("Authentication successful");
//       } catch (err) {
//         console.error("Authentication error:", err);
//         router.push("/sign-in"); // Redirect to sign-in on error
//       }
//     };
//
//     handleCallback();
//   }, [router, handleRedirectCallback]);
//
//   return <div>Processing authentication...</div>;
// }
