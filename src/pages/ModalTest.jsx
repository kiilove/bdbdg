import React, { useState } from "react";
import { MyModal } from "./MyModal";

const ModalTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([
    { id: "item-1", content: "Item 1" },
    { id: "item-2", content: "Item 2" },
    { id: "item-3", content: "Item 3" },
  ]);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <MyModal isOpen={isOpen} onClose={handleCloseModal} items={items} />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={() => setIsOpen(true)}
      >
        Open Modal
      </button>
    </div>
  );
};

export default ModalTest;
