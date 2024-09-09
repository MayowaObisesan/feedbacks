"use client";

import { createContext, useContext } from "react";

interface IFeedbacksContext {}
interface FeedbacksProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

const FeedbacksContext = createContext<IFeedbacksContext>({});

const FeedbacksProvider: React.FC<FeedbacksProviderProps> = ({ children }) => {
  return (
    <FeedbacksContext.Provider value={{}}>{children}</FeedbacksContext.Provider>
  );
};

export const useFeedbacksContext = () => useContext(FeedbacksContext);
export default FeedbacksProvider;
