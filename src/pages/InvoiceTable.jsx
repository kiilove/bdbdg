import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "@mui/material";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { widgetTitle } from "../components/Titles";
import { EditcupContext } from "../context/EditcupContext";
import useFirestore from "../customhooks/useFirestore";
import EditInvoice from "../modals/EditInvoice";
const INVOICE_HEADERS = [
  { title: "확정여부", size: "10%" },
  { title: "이름", size: "25%" },
  { title: "연락처", size: "25%" },
  { title: "이메일", size: "25%" },
  { title: "신청일자", size: "15%" },
];

const InvoiceTable = ({ data, id, onUpdate }) => {
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalComponent, setModalComponent] = useState();
  const [invoiceTableDatas, setInvoiceTableDatas] = useState([...data]);

  const { editCup, dispatch } = useContext(EditcupContext);

  const {
    data: getCups,
    error: cupsError,
    updateData: cupsUpdateData,
  } = useFirestore();
  const {
    data: getInvoices,
    error: invoiceError,
    updateData: invoiceUpdateData,
    readData: invoiceReadData,
  } = useFirestore();

  const handleStateAndDBUpdate = async ({ id, updatedData }) => {
    console.log(id);
    await cupsUpdateData("cups", id, { ...updatedData });
    dispatch({ type: "EDIT", payload: { cupData: { ...updatedData } } });
  };
  const handleListAndDBUpdate = async ({ id, updatedData }) => {
    await invoiceUpdateData("cupsjoin", id, {
      ...updatedData,
    });
    const filterForRefresh = invoiceTableDatas.findIndex(
      (filter) => filter.id === id
    );
    console.log(filterForRefresh);
    const newInvoiceTableDatas = [...invoiceTableDatas];
    newInvoiceTableDatas.splice(filterForRefresh, 1, updatedData);
    setInvoiceTableDatas(newInvoiceTableDatas);
  };

  const handleOpenModal = ({ component, title }) => {
    setModalComponent(() => component);
    setModalTitle((prev) => (prev = title));
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  useEffect(() => {
    console.log(invoiceTableDatas);
  }, [invoiceTableDatas]);

  return (
    <div className="flex w-full">
      <Modal open={modal} onClose={handleCloseModal}>
        <div
          className="absolute top-1/2 left-1/2 border-0 px-10 py-3 outline-none rounded-lg flex flex-col"
          style={{
            backgroundColor: "rgba(7,11,41,1)",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Modal창을 닫기 위해 제목을 부모창에서 열도록 설계했음 */}
          <div className="flex w-full">
            <div className="flex w-1/2">
              {widgetTitle({ title: modalTitle })}
            </div>
            <div
              className="flex w-1/2 justify-end items-center hover:cursor-pointer"
              onClick={() => handleCloseModal()}
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="text-white text-2xl font-bold"
              />
            </div>
          </div>
          {modalComponent}
        </div>
      </Modal>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
          <tr>
            {INVOICE_HEADERS.map((header, idx) => (
              <th
                className="py-3 px-6 "
                key={header.title}
                id={header.title}
                style={{ width: header.size }}
              >
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoiceTableDatas?.map((invoice, iIdx) => (
            <tr>
              <td className=" y-3 px-6  ">
                {!invoice.isConfirmed ? (
                  <div className="px-2 bg-yellow-400 w-14 rounded-lg flex justify-center text-yellow-900">
                    대기
                  </div>
                ) : (
                  <div className="px-2 bg-blue-400 w-14 rounded-lg flex justify-center text-blue-900">
                    확정
                  </div>
                )}
              </td>
              <td className="text-white text-sm font-semibold py-3 px-6 ">
                <button
                  className="h-full"
                  onClick={() =>
                    handleOpenModal({
                      component: (
                        <EditInvoice
                          collectionId={invoice.id}
                          cupFee={editCup.cupInfo.cupFee}
                          onUpdateCup={handleStateAndDBUpdate}
                          onUpdateJoin={handleListAndDBUpdate}
                        />
                      ),
                      title: "참가신청서(신청서상 정보만 변경)",
                    })
                  }
                >
                  {invoice.pName}{" "}
                  <span className="text-white px-2 py-1  bg-blue-500 ml-2 rounded-lg">
                    확정처리
                  </span>
                </button>
              </td>
              <td className="text-white text-sm font-semibold py-3 px-6">
                {invoice.pTel}
              </td>
              <td className="text-white text-sm font-semibold py-3 px-6">
                {invoice.pEmail}
              </td>
              <td className="text-white text-sm font-semibold py-3 px-6">
                {dayjs(invoice.invoiceDate).format("YYYY-MM-DD")}
              </td>
              <td className="text-white text-sm font-semibold py-3 px-6">
                {invoice[iIdx + 5]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
