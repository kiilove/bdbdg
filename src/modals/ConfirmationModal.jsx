import { Modal } from "@mui/material";
import React from "react";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  const handleConfirmClick = () => {
    onConfirm();
  };

  const handleCancelClick = () => {
    onCancel();
  };
  return (
    <div>
      <Modal open={isOpen} onClose={handleCancelClick}>
        <div
          className="flex flex-col w-96 h-40 bg-gray-800 justify-center items-center absolute top-1/2 left-1/2 gap-y-2 rounded-lg border"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex flex-col gap-y-2 text-white h-16 items-center">
            <h2 className="text-lg font-semibold">{message.body}</h2>
          </div>
          <div className="flex justify-center gap-x-5">
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-2 px-4 mr-4 text-sm"
              onClick={handleCancelClick}
            >
              {message.cancelButtonText}
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded py-1 px-4 text-sm"
              onClick={handleConfirmClick}
            >
              {message.confirmButtonText}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
