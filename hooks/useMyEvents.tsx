import { useCallback, useEffect, useState } from "react";
import useRead from "./useRead";

const useMyEvents = (ids, dep) => {
  const [events, setEvents] = useState<any>([]);

  const fetchEvents = useCallback(async () => {
    console.log("id & dep == ", ids, dep);
    ids?.map((eachId) => {
      const { data: singleEventData } = useRead({
        functionName: "getEvent",
        args: [eachId],
      });
      setEvents((prev) => prev?.push(singleEventData));
    });

    console.log(ids, events);

    // const fetchPosts = async () => {
    try {
      // const contract = await getInkContract(provider, false);
      // const allPosts = await contract.getPosts(0, 100);
      // const validPosts = allPosts.filter((post) => post[2] !== "");
      // console.log(validPosts.length);
      //   ids.map(() => {});
      // setEvents(validPosts);
    } catch (error) {
      console.error("Error fetching post count:", error);
    }
    // };
  }, [dep]);

  //   useEffect(() => {
  fetchEvents();
  //   }, [fetchEvents, dep]);

  return events;
};

export default useMyEvents;
