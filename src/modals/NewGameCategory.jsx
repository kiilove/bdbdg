import { useEffect, useRef, useState } from "react";

import { formTitle } from "../components/Titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import useFirestore from "../customhooks/useFirestore";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

const NewGameCategory = () => {
  const [category, setCategory] = useState({
    title: "",
    launched: true,
    class: [],
  });
  const [categoryCount, setCategoryCount] = useState(0);
  const { data, loading, error, readData, addData, deleteData, updateData } =
    useFirestore();

  const gameClassRef = useRef();
  const handleInputs = (e) => {
    if (e.target.name !== "gameClass") {
      setCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      //console.log(Encrypter(e.target.value ));
    }
  };

  const handleSaveCategory = () => {
    const clearCallback = () => {
      setCategory({
        title: "",
        launched: true,
        class: [],
      });
      gameClassRef.current.value = "";
    };
    addData("gamesCategory", category, clearCallback());
  };
  const handleKeyPress = (e) => {
    e.keyCode === 13 && handleClass();
  };

  const handleClass = () => {
    let classArray = [...category.class];
    const classTitle = gameClassRef.current.value;
    if (classTitle) {
      classArray.push({ title: classTitle, launched: true });
      setCategory((prev) => ({ ...prev, class: [...classArray] }));
    }
  };

  const handleIndex = (action) => {
    switch (action) {
      case "plus":
        categoryCount === 0
          ? setCategoryCount(1)
          : setCategoryCount((prev) => Number(prev) + 1);
        break;
      case "minus":
        categoryCount > 1
          ? setCategoryCount((prev) => Number(prev) - 1)
          : setCategoryCount(1);
        break;

      default:
        return categoryCount;
    }
    setCategory((prev) => ({ ...prev, index: categoryCount }));
  };

  useEffect(() => {
    readData("gamesCategory");
  }, []);

  useEffect(() => {
    setCategoryCount(data.length);
    setCategory((prev) => ({ ...prev, index: data.length + 1 }));
  }, [data]);

  useEffect(() => {
    console.log(category);
  }, [category, categoryCount]);

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "500px", maxWidth: "800px" }}
    >
      {loading && <div>로딩중</div>}
      {error && <div>페이지 오류</div>}
      <div className="flex w-full h-full flex-col flex-wrap box-border">
        <div className="flex w-full">
          {formTitle({ title: "순서참고번호" })}
        </div>
        <div className="flex">
          <div
            className={`${inputBoxStyle} justify-center`}
            style={{ width: "45px" }}
          >
            <span className="text-sm text-white flex justify-start items-center">
              {categoryCount + 1}
            </span>
          </div>
          <div className="flex flex-col justify-center ml-1">
            <div className="flex bg-sky-800 text-white justify-center items-center w-4 h-4">
              <button onClick={() => handleIndex("plus")}>+</button>
            </div>
            <div className="flex bg-sky-800 text-white justify-center items-center w-4 h-4">
              <button
                onClick={() => {
                  handleIndex("minus");
                }}
              >
                -
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full">{formTitle({ title: "종목명" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="title"
            value={category.title}
            id="gameTitle"
            onChange={(e) => handleInputs(e)}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "선수성별" })}</div>
        <div className="flex px-2 my-2 gap-x-4">
          <label htmlFor="gameGenderA">
            <input
              type="radio"
              name="gender"
              id="gameGenderA"
              value="all"
              defaultChecked
              onChange={(e) => handleInputs(e)}
            />
            <span className="text-white ml-2 text-sm">모두</span>
          </label>
          <label htmlFor="gameGenderM">
            <input
              type="radio"
              name="gender"
              id="gameGenderM"
              value="m"
              onChange={(e) => handleInputs(e)}
            />
            <span className="text-white ml-2 text-sm">남자</span>
          </label>
          <label htmlFor="gameGenderF">
            <input
              type="radio"
              name="gender"
              id="gameGenderF"
              value="f"
              onChange={(e) => handleInputs(e)}
            />
            <span className="text-white ml-2 text-sm">여자</span>
          </label>
        </div>
        <div className="flex w-full">{formTitle({ title: "체급/구분" })}</div>
        <div className="flex w-full">
          <div className={inputBoxStyle} style={{ width: "200px" }}>
            <input
              type="text"
              name="classTitle"
              id="classTitle"
              ref={gameClassRef}
              onKeyDown={(e) => handleKeyPress(e)}
              className={inputTextStyle}
              style={{ width: "200px" }}
            />
            <div className="flex ml-5 w-full justify-center items-center">
              <button
                className="flex justify-center items-center w-8 h-8 bg-sky-500 rounded-xl"
                onClick={() => handleClass()}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-white text-sm flex justify-center items-center ml-1"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full h-full mt-3 px-3 gap-2">
          {category.class.length > 0 &&
            category.class.map((items, idx) => (
              <div className="flex p-2 rounded bg-sky-500">
                <div className="flex justify-start items-center h-6">
                  <span className="text-white text-sm">{items.title}</span>
                </div>
                <div className="flex justify-start items-center h-6">
                  <button className="flex justify-center items-center bg-sky-700 w-4 h-4 rounded-full ml-2">
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-white text-sm"
                    />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="flex w-full justify-end mt-5">
          <button
            className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
            onClick={() => handleSaveCategory()}
          >
            <FontAwesomeIcon icon={faSave} className="text-white text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGameCategory;
