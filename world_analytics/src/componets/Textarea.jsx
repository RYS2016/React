import { useState } from "react";
import Warning from "./Warning";

export default function Textarea({ text, setText }) {
  const [warningText, setWarningText] = useState("");

  const handleChange = (event) => {
    let newText = event.target.value;
    //basic validation
    if (newText.includes("<script>")) {
      setWarningText("No script tag allowed!!");
      newText = newText.replace("<script>", "");
    } else if (newText.includes("@")) {
      setWarningText("No @ allowed!!");
      newText = newText.replace("@", "");
    } else {
      setWarningText("");
    }
    setText(newText);
  };

  return (
    <div className="textarea">
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Enter your text"
        spellCheck="false"
      />
      <Warning warningText={warningText} />
    </div>
  );
}
