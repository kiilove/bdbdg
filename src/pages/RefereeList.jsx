import {
  faBalanceScale,
  faPencilSquare,
  faPlus,
  faTimes,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Bars } from "react-loader-spinner";
import { db } from "../firebase";
import { Modal } from "@mui/material";
import { NewReferee } from "../modals/NewReferee";
import { widgetTitle } from "../components/Titles";
import { Decrypter } from "../components/Encrypto";
import { handleToast } from "../components/HandleToast";

const tableHeaders = [
  "순번",
  "프로필",
  "아이디",
  "이름",
  "지역",
  "연락처",
  "이메일",
  "액션",
];

const RefereeList = () => {
  const [resCollections, setResCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  let dataArray = [];
  let resDocs;

  const handleOpenModal = ({ component }) => {
    console.log(component);
    setModalComponent(() => component);
    setModal(true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(false);
  };
  const getCollections = async () => {
    setIsLoading(true);
    setResCollections([]);
    try {
      resDocs = await getDocs(collection(db, "referee"));
      resDocs.forEach((doc) => {
        dataArray.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      handleToast({ type: "info", msg: "심판 정보 불러오기 완료" });
      setResCollections(dataArray);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCollections();
  }, [modal]);

  return (
    <>
      {isLoading ? (
        <div className="flex w-full h-screen justify-center items-center align-middle">
          <Bars color="white" />
        </div>
      ) : (
        resCollections && (
          <div className="flex w-full h-full flex-col gap-y-5">
            <Modal open={modal} onClose={handleCloseModal}>
              <div
                className="absolute top-1/2 left-1/2 border-0 px-10 py-3 outline-none rounded-lg flex flex-col"
                style={{
                  backgroundColor: "rgba(7,11,41,0.9)",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Modal창을 닫기 위해 제목을 부모창에서 열도록 설계했음 */}
                <div className="flex w-full">
                  <div className="flex w-1/2">
                    {widgetTitle({ title: "심판등록" })}
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
                <div className="flex">{modalComponent}</div>
              </div>
            </Modal>
            <div className="flex w-full flex-col">
              <div className="flex w-full p-5 h-36 justify-center align-middle">
                <div
                  className="flex w-full h-full p-5 box-border items-center rounded-lg"
                  style={{ backgroundColor: "rgba(7,11,41,0.7)" }}
                >
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-x-5 w-1/2 ">
                      <div className="flex p-3 bg-sky-500 rounded-2xl">
                        <FontAwesomeIcon
                          icon={faBalanceScale}
                          className="text-2xl text-white"
                        />
                      </div>
                      <span className="text-white text-lg font-semibold">
                        심판진
                      </span>
                    </div>
                    <div className="flex justify-end items-center gap-x-5 w-1/2 ">
                      <div className="flex">
                        <button
                          className="flex w-12 h-12 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
                          onClick={() =>
                            handleOpenModal({
                              component: <NewReferee pSetModal={setModal} />,
                            })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="text-white"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full p-5 justify-center align-middle">
                <div
                  className="flex w-full h-full p-5 box-border items-center rounded-lg"
                  style={{ backgroundColor: "rgba(7,11,41,0.3)" }}
                >
                  <div className="flex w-full flex-wrap box-border justify-between gap-y-5">
                    <div className="flex w-full px-5">
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                          <tr>
                            {tableHeaders &&
                              tableHeaders.map((item, idx) => (
                                <th className="py-3 px-6" key={item}>
                                  {item}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {resCollections &&
                            resCollections.map((item, idx) => (
                              <tr className=" border-b border-gray-700">
                                <td className="text-white text-sm font-semibold py-3 px-6">
                                  {Number(idx) + 1}
                                </td>
                                <td className="text-white text-sm font-light py-3 px-6">
                                  <div className="flex ">
                                    <img
                                      src={item.refProfile}
                                      className="flex rounded-2xl"
                                    />
                                  </div>
                                </td>
                                <td className="text-white text-sm font-light py-3 px-6">
                                  {item.refUid.substring(1, 7)}
                                  <span>...</span>
                                </td>
                                <td className="text-white text-sm font-light py-3 px-6">
                                  {Decrypter(item.refName)}
                                </td>
                                <td className="text-white text-sm font-light py-3 px-6">
                                  {Decrypter(item.refLocation)}
                                </td>
                                <td className="text-white text-sm font-light py-3 px-6">
                                  {Decrypter(item.refTel)}
                                </td>
                                <td className="text-white text-sm font-light py-3 px-6">
                                  {Decrypter(item.refEmail)}
                                </td>
                                <td className="text-white text-sm font-light py-3 px-6 gap-x-5 flex justify-center">
                                  <div className="flex justify-end items-center">
                                    <FontAwesomeIcon
                                      icon={faPencilSquare}
                                      className="text-lg"
                                    />
                                  </div>
                                  <div className="flex justify-end items-center">
                                    <FontAwesomeIcon
                                      icon={faTrashCan}
                                      className="text-lg"
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default RefereeList;
