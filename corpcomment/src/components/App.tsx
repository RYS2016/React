import Container from "./layout/Container";
import Footer from "./layout/Footer";
import HashTagList from "./hashtag/HashTagList";

import FeedBackItemsContextProvider from "../context/FeedBackItemsContextProvider";

function App() {
  return (
    <div className="app">
      <Footer />

      <FeedBackItemsContextProvider>
        <Container />
        <HashTagList />
      </FeedBackItemsContextProvider>
    </div>
  );
}

export default App;
