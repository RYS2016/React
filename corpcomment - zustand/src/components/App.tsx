import Container from "./layout/Container";
import Footer from "./layout/Footer";
import HashTagList from "./hashtag/HashTagList";
import { useEffect } from "react";
import { useFeedBackItemsStore } from "../store/FeedBackItemsStore";

function App() {
  const fetchFeedBackItems = useFeedBackItemsStore(
    (state) => state.fetchFeedbackItems
  );

  useEffect(() => {
    fetchFeedBackItems();
  }, [fetchFeedBackItems]);

  return (
    <div className="app">
      <Footer />
      <Container />
      <HashTagList />
    </div>
  );
}

export default App;
