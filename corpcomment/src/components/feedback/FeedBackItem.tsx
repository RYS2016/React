import { TriangleUpIcon } from "@radix-ui/react-icons";
import { TFeedBackItem } from "../../lib/types";
import { useState } from "react";

type FeedBackItemProps = { feedBackItem: TFeedBackItem };

export default function FeedBackItem({ feedBackItem }: FeedBackItemProps) {
  const [open, setOpen] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(feedBackItem.upvoteCount);
  const handleUpvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setUpvoteCount((prev) => ++prev);
    e.currentTarget.disabled = true;
    e.stopPropagation();
  };

  return (
    <li
      onClick={() => setOpen((prev) => !prev)}
      className={`feedback ${open ? "feedback--expand" : ""}`}
    >
      <button onClick={handleUpvote}>
        <TriangleUpIcon />
        <span>{upvoteCount}</span>
      </button>
      <div>
        <p>{feedBackItem.badgeLetter}</p>
      </div>
      <div>
        <p>{feedBackItem.company}</p>
        <p>{feedBackItem.text}</p>
      </div>
      <p>{feedBackItem.daysAgo === 0 ? "NEW" : `${feedBackItem.daysAgo}d`}</p>
    </li>
  );
}
