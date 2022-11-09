import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const Tables = (props) => {
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  //console.log(tableHeaders);
  //console.log(props.data);

  useEffect(() => {
    setTableHeaders(props.headers);
    setTableData(props.data);
    console.log(tableHeaders);
  }, [props]);

  return (
    <div className="flex w-full">
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
          {tableData &&
            tableData.map((items, idx) => (
              <>
                <tr className=" border-b border-gray-700" key={items + idx}>
                  {items.map((item, index) => (
                    <td
                      className="text-white text-sm font-semibold py-3 px-6"
                      key={item + index}
                    >
                      {item}
                    </td>
                  ))}
                </tr>
              </>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tables;
