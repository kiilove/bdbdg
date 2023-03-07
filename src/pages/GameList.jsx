import {
  faBalanceScale,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { widgetTitle } from "../components/Titles";
import useFirestore from "../customhooks/useFirestore";
import NewGameCategory from "../modals/NewGameCategory";

const GameList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  const { data, loading, error, readData, addData, deleteData, updateData } =
    useFirestore();

  const handleOpenModal = ({ component }) => {
    setModalComponent(() => component);
    setModal(true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(false);
  };

  useEffect(() => {
    readData("gamesCategory");
  }, []);

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      {loading && <div>로딩중</div>}
      {error && <div>페이지 오류</div>}
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
              {widgetTitle({ title: "종목등록" })}
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
                <span className="text-white text-lg font-semibold">종목</span>
              </div>
              <div className="flex justify-end items-center gap-x-5 w-1/2 ">
                <div className="flex">
                  <button
                    className="flex w-12 h-12 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
                    onClick={() =>
                      handleOpenModal({
                        component: (
                          <NewGameCategory
                            pSetModal={setModal}
                            pSetRefresh={setIsRefresh}
                          />
                        ),
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full px-5 justify-center align-middle">
          <div
            className="flex w-full h-full p-5 box-border items-center rounded-lg gap-5 flex-wrap "
            style={{ backgroundColor: "rgba(7,11,41,0.3)" }}
          >
            {data.map((item, idx) => (
              <div
                className="flex flex-col w-52 h-52 rounded-lg shadow p-4 gap-y-3"
                style={{ backgroundColor: "rgba(7,11,41,0.5" }}
              >
                <div className="flex w-full h-10 justify-center items-center bg-slate-800 rounded-lg">
                  <span className="text-white text-sm">{item.title}</span>
                </div>
                <div className="flex w-full flex-wrap gap-2 justify-between">
                  {item.class.map((items, iIdx) => (
                    <div className="p-1 rounded bg-sky-500">
                      <span className="text-white text-sm">{items.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameList;
