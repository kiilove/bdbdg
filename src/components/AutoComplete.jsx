import { useEffect, useMemo, useState } from "react";
import useFirestore from "../customhooks/useFirestore";

const AutoCompleteInput = (collectionName) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestionList, setSuggestionList] = useState([]);
  const [getData, setGetData] = useState([]);
  const { data, error, readData } = useFirestore();

  useMemo(() => {
    if (data.length === 0) {
      return;
    }
    setGetData([...data]);
  }, [data]);
  
  useEffect(() => {
    readData(collectionName);
    return () => {
      setGetData([]);
    };
  }, [collectionName]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    // 입력값이 포함된 항목들만 suggestionList에 추가
    const filteredList = associationList.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestionList(filteredList);
  };

  return (
    <div>
      <input type="text" value={inputValue} onInput={handleInputChange} />

      {/* suggestionList가 있을 때만 자동완성 목록을 보여줌 */}
      {suggestionList.length > 0 && (
        <ul>
          {suggestionList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
