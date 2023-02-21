import React from "react";

const CompleteCup = () => {
  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <div className="flex w-full flex-col p-10  h-32">
        <div className="flex w-full">
          <h1 className="text-white text-2xl font-extrabold w-full text-center align-middle">
            대회 개최 준비를 마칩니다.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CompleteCup;
