import React from "react";
import { useState } from "react";

const Tables = (props) => {
  const [tableHeaders, setTableHeader] = useState(props.headers);
  const [tableData, setTableData] = useState(props.data);
  console.log(tableHeaders);
  return (
    <div className="flex w-full">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
          <tr>
            {tableHeaders &&
              tableHeaders.map((item) => (
                <th className="py-3 px-6" key={item}>
                  {item}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows &&
            tableData.rows.map((item, idx) => (
              <tr className=" border-b border-gray-700">
                <td className="text-white text-sm font-semibold py-3 px-6">
                  {item.id}
                </td>
                <td className="text-white text-sm font-semibold py-3 px-6">
                  {item.name}
                </td>
                <td className="text-white text-sm font-semibold py-3 px-6">
                  {item.location}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tables;
