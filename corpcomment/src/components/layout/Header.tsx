import Pattern from "../Pattern";
import Logo from "../Logo";
import PageHeading from "../PageHeading";
import FeedBackForm from "../feedback/FeedBackForm";
import { useFeedBackItemContext } from "../../lib/hooks";

export default function Header() {
  const { handleAddToList } = useFeedBackItemContext();
  return (
    <header>
      <Pattern />
      <Logo />
      <PageHeading />
      <FeedBackForm onAddToList={handleAddToList} />
    </header>
  );
}
