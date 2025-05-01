import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

export default function CountButton({ type, setCount, locked }) {
  function handleClick(event) {
    setCount((prev) => {
      if (type === "minus") {
        const newCount = prev - 1;
        if (newCount < 0) {
          return 0;
        }
        return newCount;
      } else if (type === "plus") {
        const newCount = prev + 1;
        if (newCount > 5) {
          return 5;
        }
        return newCount;
      }
      return prev; // Fallback in case of an unexpected type
    });
    event.currentTarget.blur();
  }
  return (
    <button disabled={locked} onClick={handleClick} className="count-btn">
      {type === "minus" ? ( //ternary operator
        <MinusIcon className="count-btn-icon" />
      ) : (
        <PlusIcon className="count-btn-icon" />
      )}
      {
        // Another way to write the above code is to use a logical AND operator
        // type === "minus" && <MinusIcon className="count-btn-icon" />
        // type === "plus" && <PlusIcon className="count-btn-icon" />
      }
    </button>
  );
}
