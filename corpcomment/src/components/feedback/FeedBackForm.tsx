import { useState } from "react";
import { MAX_CHARACTERS } from "../../lib/constants";

type FeedBackFormProps = {
  onAddToList: (text: string) => void;
};

export default function FeedBackForm({ onAddToList }: FeedBackFormProps) {
  const [text, setText] = useState("");
  const [showValidIndicator, setShowValidIndicator] = useState(false);
  const [showInValidIndicator, setShowInValidIndicator] = useState(false);
  const charCount = MAX_CHARACTERS - text.length;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    if (newText.length > MAX_CHARACTERS) return; //guard statment(basic validation)
    setText(event.target.value);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //basic validation
    if (text.includes("#") && text.length >= 5) {
      setShowValidIndicator(true);
      setTimeout(() => {
        setShowValidIndicator(false);
      }, 2000);
    } else {
      setShowInValidIndicator(true);
      setTimeout(() => {
        setShowInValidIndicator(false);
      }, 2000);
      return;
    }
    onAddToList(text);
    setText("");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={`form ${showValidIndicator ? "form--valid" : ""} ${
        showInValidIndicator ? "form--invalid" : ""
      }`}
    >
      <textarea
        value={text} //controlled text area by using useState
        onChange={handleChange}
        id="feedback-textarea"
        placeholder="blabal"
        spellCheck={false}
      />

      <label htmlFor="feedback-textarea">
        Enter your feedback here, remember to #hashtag the company
      </label>

      <div>
        <p className="u-italic">{charCount}</p>
        <button>
          <span>Submit</span>
        </button>
      </div>
    </form>
  );
}
