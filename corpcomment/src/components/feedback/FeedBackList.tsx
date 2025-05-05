import FeedBackItem from "./FeedBackItem";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";
import { useFeedBackItemContext } from "../../lib/hooks";

export default function FeedBackList() {
  const { isLoading, errorMessage, filteredFeedBackItems } =
    useFeedBackItemContext();
  return (
    <ol className="feedback-list">
      {isLoading && <Spinner />}
      {/* or ternary operator */}
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      {filteredFeedBackItems.map((item) => (
        <FeedBackItem key={item.id} feedBackItem={item} />
      ))}
    </ol>
  );
}
