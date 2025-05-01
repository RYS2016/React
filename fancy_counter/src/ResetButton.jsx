import { ResetIcon } from "@radix-ui/react-icons";

export default function ResetButton({ setCount }) {
  const handleRest = (event) => {
    setCount(0);
    event.currentTarget.blur();
  };

  return (
    <button onClick={handleRest} className="reset-btn">
      <ResetIcon className="reset-btn-icon" />
    </button>
  );
}
