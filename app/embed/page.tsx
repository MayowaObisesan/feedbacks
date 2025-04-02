"use client";

import FeedbacksForm from "@/components/sdk";

export default function EmbedPage() {
  /*const { getToken, isLoaded, isSignedIn, sessionId, userId } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }*/

  // (async () => {
  //   fetch('/api/foo', {
  //     headers: {
  //       Authorization: `Bearer ${await Clerk.session.getToken()}`,
  //     },
  //   }).then((res) => res.json())
  // })()

  // return (
  //   <div>
  //     {/*<p>
  //       Hello, {userId}! Your current active session is {sessionId}.
  //     </p>*/}
  //     Hello there...
  //     {/*<button onClick={fetchExternalData}>Fetch Data</button>*/}
  //   </div>
  // );

  return (
    <div>
      <FeedbacksForm isPreview={false} />
    </div>
  );
}
