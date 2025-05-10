import { useFeedBackItemsStore } from "../../store/FeedBackItemsStore";
import HashtagItem from "./HashTagItem";

export default function HashtagList() {
  const companyList = useFeedBackItemsStore((state) => state.getCompanyList());
  const selectCompany = useFeedBackItemsStore((state) => state.selectCompany);

  return (
    <ul className="hashtags">
      {companyList.map((company) => (
        <HashtagItem
          key={company}
          company={company}
          onSelectCompany={selectCompany}
        />
      ))}
    </ul>
  );
}
