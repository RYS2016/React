import { createContext, useMemo, useState } from "react";
import { TFeedBackItem } from "../lib/types";
import { useFeedBackItems } from "../lib/hooks";

type TFeedBackItemsContext = {
  filteredFeedBackItems: TFeedBackItem[];
  isLoading: boolean;
  errorMessage: string;
  companyList: string[];
  handleAddToList: (text: string) => void;
  handleSelectCompany: (company: string) => void;
};
type FeedBackItemsContextProviderProps = {
  children: React.ReactNode;
};

export const FeedBackItemsContext = createContext<TFeedBackItemsContext | null>(
  null
);

export default function FeedBackItemsContextProvider({
  children,
}: FeedBackItemsContextProviderProps) {
  const { feedBackItems, isLoading, errorMessage, setFeedBackItems } =
    useFeedBackItems();
  const [selectedCompany, setSelectedCompany] = useState("");

  const companyList = useMemo(
    () =>
      feedBackItems
        .map((item) => item.company)
        .filter((company, index, array) => {
          return array.indexOf(company) === index;
        }),
    [feedBackItems]
  );

  const filteredFeedBackItems = useMemo(
    () =>
      selectedCompany
        ? feedBackItems.filter((item) => item.company === selectedCompany)
        : feedBackItems,
    [feedBackItems, selectedCompany]
  );
  const handleAddToList = async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);
    const newItem: TFeedBackItem = {
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName,
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
    };
    setFeedBackItems([...feedBackItems, newItem]);
    //or
    //setFeedBackItems(prev => [...prev, newItem])

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }
    );
  };
  const handleSelectCompany = (company: string) => {
    setSelectedCompany(company);
  };

  return (
    <FeedBackItemsContext.Provider
      value={{
        filteredFeedBackItems,
        isLoading,
        errorMessage,
        companyList,
        handleAddToList,
        handleSelectCompany,
      }}
    >
      {children}
    </FeedBackItemsContext.Provider>
  );
}
