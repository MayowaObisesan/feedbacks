"use client";

import React, { Suspense } from "react";

interface CustomSuspenseProps {
  delay?: number;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

const CustomSuspense: React.FC<CustomSuspenseProps> = ({
  delay = 0,
  fallback,
  children,
}) => {
  const [showFallback, setShowFallback] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShowFallback(true), delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!showFallback) {
    return null;
  }

  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default CustomSuspense;
