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

const CupView = () => {
  const params = useParams();
  const [cupId, setCupId] = useState(params.cupId);
  const [error, setError] = useState(null);
  const [getCupData, setGetCupData] = useState({});
  const [getInvoiceData, setGetInvoiceDate] = useState([]);

  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalComponent, setModalComponent] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { dispatch, editCup } = useContext(EditcupContext);
  const {
    data: cupData,
    error: cupError,
    getDocument: cupGetDocument,
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

  useMemo(() => {
    if (!getCupData.id) {
      return;
    }
    dispatch({
      type: "EDIT",
      payload: { cupData: { ...getCupData } },
    });

    setIsLoading(false);
  }, [getCupData]);

  useMemo(() => {
    if (!cupData.id) {
      return;
    }

    if (invoiceData.length) {
      setGetInvoiceDate(invoiceData);
    }
    setGetCupData(cupData);
  }, [cupData, invoiceData]);

  useEffect(() => {
    if (!cupId) {
      return;
    }
    cupGetDocument("cups", cupId);

    return () => {
      setGetCupData({});
      setGetInvoiceDate([]);
    };
  }, []);

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      {isLoading && <Loading />}
      {getCupData.id && (
        <>
          <div className="flex w-full h-full flex-col gap-y-5">
            <div className="flex w-full h-20 bg-slate-800">
              <div className="flex w-full h-full">대회정보/참가신청서</div>
              <div className="flex w-full h-full">종목/심판배정</div>
              <div className="flex w-full h-full">출전선수확정/배정</div>
            </div>
          </div>
        </>
      )}
      )
    </div>
  );
};

export default CupView;
