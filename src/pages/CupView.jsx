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
import WidgetWithTable from "../components/WidgetWithTable";
import { useState } from "react";
import { useEffect } from "react";
import WidgetWithTableDragable from "../components/WidgetWithTableDragable";

import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Bars } from "react-loader-spinner";
import { NewCupInfo } from "../modals/NewCupInfo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { EditCupInfo } from "../modals/EditCupInfo";
import { EditcupContext } from "../context/EditcupContext";
import { Decrypter } from "../components/Encrypto";
import GameCategoryTable from "../components/GameCategoryTable";
import EditAssignReferees from "../modals/EditAssignReferees";
import dayjs from "dayjs";
import EditInvoice from "../modals/EditInvoice";
import PlayerOrderTable from "../components/PlayerOrderTable";
import Loading from "./Loading";
import useFirestore from "../customhooks/useFirestore";
import useFirestoreSearch from "../customhooks/useFirestoreSearch";
import CupInfo from "../components/CupInfo";
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
  const [error, setError] = useState(null);
  const [getCupData, setGetCupData] = useState({});
  const [getCupInfoData, setGetCupInfoData] = useState({});
  const [getOrgsData, setGetOrgsData] = useState([]);
  const [getInvoiceData, setGetInvoiceDate] = useState([]);

  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalComponent, setModalComponent] = useState();

  const [refIds, setRefIds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  const { dispatch, editCup } = useContext(EditcupContext);
  const {
    data: cupData,
    error: cupError,
    getDocument: cupGetDocument,
  } = useFirestore();

  const {
    data: orgsData,
    error: orgsError,
    readData: orgsReadData,
  } = useFirestore();

  const {
    data: cupInfoData,
    error: cupInfoError,
    updateData: cupInfoUpdate,
    getDocument: cupInfoGetDocument,
  } = useFirestore();

  const { data: invoiceData, error: invoiceError } = useFirestoreSearch(
    "cupsjoin",
    [where("cupId", "==", cupId)]
  );

  const handleOpenModal = ({ component, title }) => {
    setModalComponent(() => component);
    setModalTitle((prev) => (prev = title));
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  const updateOn = async (updatedCupData, requestComponent) => {
    switch (requestComponent) {
      case "cupInfo":
        const updateCallback = (returnData) => {
          console.log("업데이트완료", returnData);
        };
        cupInfoUpdate(
          "cupInfo",
          refIds.refCupInfo,
          updatedCupData,
          updateCallback()
        );
        break;

      default:
        break;
    }
  };

  useMemo(() => console.log(getCupInfoData), [getCupInfoData]);

  useMemo(() => {
    if (!cupInfoData.id) {
      return;
    }
    setGetCupInfoData({ ...cupInfoData });
  }, [cupInfoData]);

  useMemo(() => {
    if (!getCupData.refCupInfo) {
      return;
    }
    cupInfoGetDocument("cupInfo", getCupData.refCupInfo);
  }, [getCupData.refCupInfo]);

  useMemo(() => {
    if (!getCupData.id) {
      return;
    }
    dispatch({
      type: "EDIT",
      payload: { cupData: { ...getCupData } },
    });

    setRefIds({ ...getCupData });

    setIsLoading(false);
  }, [getCupData]);

  useMemo(() => {
    if (!cupData.id) {
      return;
    }

    if (invoiceData.length) {
      setGetInvoiceDate(invoiceData);
    }

    if (orgsData.length) {
      setGetOrgsData([...orgsData]);
    }
    console.log(orgsData);

    setGetCupData(cupData);
  }, [cupData, invoiceData, orgsData]);

  useEffect(() => {
    if (!cupId) {
      return;
    }
    cupGetDocument("cups", cupId);
    orgsReadData("orgs");

    return () => {};
  }, [cupId]);

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      {isLoading && <Loading />}
      {getCupData.id && (
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
      )}
    </div>
  );
};

export default CupView;
