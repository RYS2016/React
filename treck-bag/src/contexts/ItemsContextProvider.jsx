import { createContext, useEffect, useState } from "react";
import { initialItems } from "../lib/constants";

export const ItemsContext = createContext();

export default function ItemsContextProvider({ children }) {
  const [items, setItems] = useState(() => {
    const storedItems = localStorage.getItem("items");
    return storedItems ? JSON.parse(storedItems) : initialItems;
  });

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleAddItem = (newItemText) => {
    const newItem = {
      id: new Date().getTime(),
      name: newItemText,
      packed: false,
    };
    const newItems = [...items, newItem];

    setItems(newItems);
  };
  const handleTogleItem = (id) => {
    const newItems = items.map((item) => {
      if (item.id == id) {
        return { ...item, packed: !item.packed };
      }
      return item;
    });
    setItems(newItems);
  };
  const handleDeleteItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };
  const handleRemoveAllItems = () => {
    setItems([]); //setting to an empty array
  };
  const handleReseToInitial = () => {
    setItems(initialItems);
  };
  const handleMarkAllAsComplete = () => {
    const newItems = items.map((item) => ({
      ...item, // Spread the current item to ensure we don’t mutate the original object
      packed: true, // Set packed to true
    }));
    setItems(newItems); // Update the state with the new array
  };
  const handleMarkAllAsInComplete = () => {
    const newItems = items.map((item) => ({
      ...item, // Spread the current item to ensure we don’t mutate the original object
      packed: false, // Set packed to true
    }));
    setItems(newItems); // Update the state with the new array
  };
  return (
    <ItemsContext.Provider
      value={{
        items,
        handleAddItem,
        handleDeleteItem,
        handleTogleItem,
        handleRemoveAllItems,
        handleReseToInitial,
        handleMarkAllAsComplete,
        handleMarkAllAsInComplete,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}
