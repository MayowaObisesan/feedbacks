"use client";

import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span aria-label="share icon" role="img">
            {" "}
            ⎋{" "}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span aria-label="plus icon" role="img">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}

// export default function Page() {
//   return (
//     <div>
//       <PushNotificationManager />
//       <InstallPrompt />
//     </div>
//   );
// }
