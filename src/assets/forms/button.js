import React, { useState } from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const NextButton = () => {
  return (
    <button
      id="menuItemIconBox"
      className="flex w-20 h-10 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
    >
      <FontAwesomeIcon
        icon={faArrowRight}
        className="text-xl text-white font-extrabold"
      />
    </button>
  );
};
