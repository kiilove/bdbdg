import React, { useCallback, useContext, useMemo, useReducer } from "react";
import { Modal } from "@mui/material";
import { widgetTitle } from "../components/Titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFlagCheckered,
  faPenToSquare,
  faPeopleLine,
  faPlus,
  faScaleBalanced,
  faSitemap,
  faSquarePen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { useEffect } from "react";

import { useParams } from "react-router-dom";

import { Bars } from "react-loader-spinner";
import { EditcupContext } from "../context/EditcupContext";
import { Decrypter } from "../components/Encrypto";

import Loading from "./Loading";
import useFirestore from "../customhooks/useFirestore";
import useFirestoreSearch from "../customhooks/useFirestoreSearch";
import CupInfo from "../components/CupInfo";
import useFirestoreCollectionGroups from "../customhooks/useFirestoreCollectionGroups ";

const REFEREE_HEADERS = ["이름", "이메일", "연락처"];
const PLAYER_HEADERS = ["이름", "연락처", "참가신청서"];
const INVOICE_HEADERS = [
  "이름",
  "이메일",
  "연락처",
  "신청일자",
  "신청종목",
  "액션",
];

const GAME_HEADERS = [
  { title: "경기순서", size: "10%" },
  { title: "종목명", size: "15%" },
  { title: "체급", size: "30%" },
  { title: "참가신청 선수", size: "10%" },
  { title: "배정된 심판", size: "10%" },
  { title: "액션", size: "10%" },
];
const TABS = ["대회정보/참가신청서", "종목/심판배정", "출전선수확정/배정"];

const CupView = () => {
  const params = useParams();
  const [cupId, setCupId] = useState(params.cupId);

  const [refIds, setRefIds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  const { dispatch, editCup } = useContext(EditcupContext);

  const collections = [
    { name: "cupInfo", fieldName: "refCupId" },
    { name: "refereeAssign", fieldName: "refCupId" },
    { name: "categoryAssign", fieldName: "refCupId" },
  ];

  const [data, loading, error] = useFirestoreCollectionGroups(
    cupId,
    collections
  );

  useMemo(() => console.log(data), [data]);
  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      {isLoading && <Loading />}
      {/* {getCupData.id && (
        <>
          <div className="flex w-full h-full flex-col gap-y-2">
            <div
              className="flex w-full h-14 p-2 rounded-lg"
              style={{ backgroundColor: "rgba(7,11,41,0.5)" }}
            >
              {TABS.map((tab, idx) => (
                <button
                  className={`${
                    currentTab === idx
                      ? "  bg-gray-300 text-gray-800 "
                      : " text-gray-200 "
                  }flex w-full h-full rounded-lg justify-center items-center text-base font-semibold`}
                  onClick={() => setCurrentTab((prev) => (prev = idx))}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div
              className="flex w-full rounded-lg h-full"
              style={{
                minHeight: "550px",
              }}
            >
              {currentTab === 0 && (
                <div className="flex w-full justify-around items-start flex-wrap box-border rounded-lg p-0">
                  <div
                    className="flex w-full h-full rounded-lg"
                    // style={{
                    //   backgroundColor: "rgba(7,11,41,0.5)",
                    // }}
                  >
                    <CupInfo
                      orgs={getOrgsData}
                      cupInfo={getCupInfoData}
                      updateOn={updateOn}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )} */}
    </div>
  );
};

export default CupView;
