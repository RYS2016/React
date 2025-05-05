import { useFeedBackItemContext } from "../../lib/hooks";
import HashTagItem from "./HashTagItem";

export default function HashTagList() {
  const { companyList, handleSelectCompany } = useFeedBackItemContext();
  return (
    <ul className="hashtags">
      {companyList.map((company) => (
        <HashTagItem company={company} onSelectCompany={handleSelectCompany} />
      ))}
    </ul>
  );
}
