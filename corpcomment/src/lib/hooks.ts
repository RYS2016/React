import { useContext, useEffect, useState } from "react";
import { FeedBackItemsContext } from "../context/FeedBackItemsContextProvider";
import { TFeedBackItem } from "./types";

//Custom Hook
export function useFeedBackItemContext() {
  const context = useContext(FeedBackItemsContext);
  if (!context) {
    throw new Error(
      "FeedBackList must be used within a FeedBackItemsContextProvider"
    );
  }
  return context;
}

export function useFeedBackItems() {
  const [feedBackItems, setFeedBackItems] = useState<TFeedBackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const fetchFeedBackItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
        );
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        setFeedBackItems(data.feedbacks);
      } catch (error) {
        setErrorMessage("Something went wrong. Please try again later.");
      }
      setIsLoading(false);
    };
    fetchFeedBackItems();
    //classic approach using fetch api
    /*     setIsLoading(true);
          fetch(
            "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error();
              }
              return response.json();
            })
            .then((data) => {
              setFeedBackItems(data.feedbacks);
              setIsLoading(false);
            })
            .catch(() => {
              setErrorMessage("Something went wrong!!!");
              setIsLoading(false);
            }); */
  }, []);
  return {
    feedBackItems,
    isLoading,
    errorMessage,
    setFeedBackItems,
  };
}
