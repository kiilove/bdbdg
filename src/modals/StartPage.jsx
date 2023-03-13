import React, { useMemo } from "react";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import useFirestore from "../customhooks/useFirestore";

const StartPage = ({ cupCreatedOn, isCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cupId, setCupId] = useState("");
  const [cupInfoId, setCupInfoId] = useState(undefined);
  const [refereeAssignId, setRefereeAssignId] = useState(undefined);
  const [categoryAssignId, setCategoryAssignId] = useState(undefined);
  const [cupData, setCupData] = useState("");
  const { error: cupError, addData, updateData } = useFirestore();

  const handleStart = async () => {
    setIsLoading(true);

    try {
      // Create a new document in the "cupData" collection
      const { id: cupId } = await addData("cups", {});
      setCupId(cupId);
      // Create new documents in the "cupInfo", "refereeAssign", and "categoryAssign" collections
      const [
        { id: cupInfoId },
        { id: cupRefereeId },
        { id: cupCategoryId },
        { id: cupJoinId },
        { id: cupScoreId },
      ] = await Promise.all([
        addData("cupInfo", {
          refCupId: cupId,
          cupName: "",
          cupPoster: [],
          cupCount: "",
          cupDate: { startDate: "", startTime: "" },
          cupOrg: "",
          cupAgency: "",
          cupLocation: "",
          cupLocationAddr: "",
          cupState: "대회준비중",
          cupFee: { basicFee: 0, extraFee: 0, extraType: "없음" },
        }),
        addData("cupReferee", { refCupId: cupId, refIds: [] }),
        addData("cupCategory", { refCupId: cupId, cateIds: [] }),
        addData("cupInvoice", { refCupId: cupId, invoiceIds: [] }),
        addData("cupScore", { refCupId: cupId, scoreIds: [] }),
      ]);
      // Update the "cups" document with the ids of the child documents
      const refs = {
        refCupInfo: cupInfoId,
        refCupReferee: cupRefereeId,
        refCupGategory: cupCategoryId,
        refCupJoinId: cupJoinId,
        refCupScoreId: cupScoreId,
      };

      updateData("cups", cupId, refs, (updatedData) => {
        console.log(updatedData);
      });

      setIsLoading(false);
      cupCreatedOn({ cupId, cupInfoId, refereeAssignId, categoryAssignId });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  return (
    <div className="flex w-full h-full bg-transparent flex-col">
      <div className="flex w-full h-full flex-col p-10">
        <div className="flex w-full h-full justify-center items-center flex-col gap-y-5">
          <h1 className="text-white text-4xl font-extrabold w-full text-center align-middle">
            대회 설계중입니다.
          </h1>
          <h1 className="text-white text-xl font-extrabold w-full text-center align-middle">
            대회정보 입력 화면으로 전환되지 않았다면 상단 메뉴에서 선택하세요
          </h1>
        </div>
        {!isCreated && (
          <div className="flex w-full h-full justify-center items-end">
            {isLoading ? (
              <button className=" w-40 h-14 bg-gray-900 border text-white text-sm justify-center items-center flex">
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#fff"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </button>
            ) : (
              <button
                className=" w-40 h-14 bg-gray-900 border text-white text-lg font-bold"
                onClick={() => handleStart()}
              >
                <span>대회개설</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartPage;
