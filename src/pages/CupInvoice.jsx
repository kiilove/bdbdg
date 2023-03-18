import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import useFirestore from "../customhooks/useFirestore";
import Loading from "./Loading";
import html2canvas from "html2canvas";
import InvoiceTable from "./InvoiceTable";

const CupInvoice = ({ cupId }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [cupInfo, setCupInfo] = useState({});
  const [posterTitle, setPosterTitle] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const params = useParams();
  const qrCodeRef = useRef(null);
  const pageSize = 20;
  const {
    data: getInvoices,
    error: cupInfoError,
    readData: invoiceReadData,
  } = useFirestore();

  const handleInvoicePlayers = (data) => {
    let dataArray = [];

    if (data !== undefined && data.length) {
      data.map((item) => {
        const itemRow = {
          id: item.id,
          isConfirmed: item.isConfirmed,
          pName: item.pName,
          pTel: item.pTel,
          pEmail: item.pEmail,
          invoiceDate: dayjs(item.invoiceDate).format("YYYY-MM-DD"),
        };
        // item.joinGames.map((game) => (
        //   <div className="flex flex-wrap w-full gap-2 h-full p-1">
        //     <span className="bg-blue-500 py-1 px-2 text-xs rounded-lg">
        //       {game.gameTitle} ({game.gameClass})
        //     </span>
        //   </div>}

        // )),
        // <div className="flex">
        //   <div className="flex">
        //     <button
        //     // onClick={() =>
        //     //   handleOpenModal({
        //     //     component: (
        //     //       <EditInvoice
        //     //         collectionId={item.id}
        //     //         cupFee={editCup.cupInfo.cupFee}
        //     //       />
        //     //     ),
        //     //     title: "참가신청서(신청서상 정보만 변경)",
        //     //   })
        //     // }
        //     >
        //       <span className="bg-blue-500 py-1 px-2 text-xs rounded-lg">
        //         참가신청서
        //       </span>
        //     </button>
        //   </div>
        //   <div className="flex"></div>
        // </div>,

        dataArray.push(itemRow);
      });
    }

    return dataArray;
  };

  const invoiceTableData = useMemo(() => {
    if (!getInvoices) {
      return;
    }
    const filteredInvoice = getInvoices.filter(
      (filter) => filter.cupId === params.cupId
    );

    const result = handleInvoicePlayers(filteredInvoice);

    setIsLoading(false);
    return result;
  }, [getInvoices]);

  useEffect(() => {
    if (params !== null) {
      invoiceReadData("cupsjoin");
    }
  }, []);

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      {isLoading && <Loading />}
      {getInvoices && (
        <div className="flex w-full h-full flex-col gap-y-5">
          <div className="flex w-full gap-x-5">
            <div
              className="flex justify-start w-full p-3 gap-y-5 rounded-lg flex-col"
              style={{ backgroundColor: "rgba(7,11,41,0.7)" }}
            >
              <div className="flex w-full h-12 bg-gray-900 justify-end items-center">
                {/* <button className="bg-gray-900 border px-3 py-2 h-10">
                  <span className="text-white">대회정보수정</span>
                </button> */}
              </div>
            </div>
          </div>
          <div
            className="flex justify-start h-full w-full p-3 gap-y-5 rounded-lg flex-col"
            style={{ backgroundColor: "rgba(7,11,41,0.7)" }}
          >
            <InvoiceTable data={invoiceTableData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CupInvoice;
