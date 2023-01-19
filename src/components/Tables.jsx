import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const BasicTable = (props) => {
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);

  //console.log(tableHeaders);
  // console.log(props.data);

  useEffect(() => {
    setTableHeaders(props.headers);
    setTableData(props.data);
    // console.log(tableHeaders);
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

export const TableDragable = (props) => {
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tableData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTableData(items);
  };
  useEffect(() => {
    setTableHeaders(props.headers);
    setTableData(props.data);
    // console.log(tableHeaders);
  }, []);

  return (
    <div className="flex w-full">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <table
              ref={provided.innerRef}
              className="w-full text-sm text-left text-gray-500"
            >
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
                  tableData.map((items, idx) => {
                    return (
                      <Draggable
                        key={items[1]}
                        draggableId={items[1]}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <tr
                            className={`border-b border-gray-700 ${
                              snapshot.isDragging ? "bg-sky-600" : ""
                            }`}
                            key={items + idx}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            {items.map((item, index) => (
                              <td
                                className="text-white text-sm font-semibold py-3 px-6"
                                key={item + index}
                              >
                                {index == 0 ? idx + 1 : item}
                              </td>
                            ))}
                          </tr>
                        )}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
