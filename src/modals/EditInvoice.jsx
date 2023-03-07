import React, { useEffect } from "react";
import useFirestore from "../customhooks/useFirestore";

const EditInvoice = ({ collectionId }) => {
  console.log(collectionId);
  const { data, loading, error, getDocument } = useFirestore();

  useEffect(() => {
    getDocument("cupsJoin", collectionId);
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border flex-col"
      style={{ minWidth: "1000px", maxWidth: "1200px" }}
    >
      {loading && <div>로딩중</div>}
      {error && <div>페이지 오류</div>}
      <div className="flex w-full p-5 bg-white flex-col items-start">
        <div className="flex">참가신청서 일련번호</div>
      </div>
    </div>
  );
};

export default EditInvoice;
