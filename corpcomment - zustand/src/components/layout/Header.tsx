import Pattern from "../Pattern";
import Logo from "../Logo";
import PageHeading from "../PageHeading";
import FeedBackForm from "../feedback/FeedBackForm";
import { useFeedBackItemsStore } from "../../store/FeedBackItemsStore";
//import { useFeedBackItemContext } from "../../lib/hooks";

export default function Header() {
  //const { handleAddToList } = useFeedBackItemContext();
  const addItemToList = useFeedBackItemsStore((state) => state.addItemToList);
  return (
    <header>
      <Pattern />
      <Logo />
      <PageHeading />
      <FeedBackForm onAddToList={addItemToList} />
    </header>
  );
}
