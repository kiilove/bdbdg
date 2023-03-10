import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const finalSpaceCharacters = [
  {
    id: "gary",
    name: "Gary Goodspeed",
    thumb: "/images/gary.png",
  },
  {
    id: "cato",
    name: "Little Cato",
    thumb: "/images/cato.png",
  },
  {
    id: "kvn",
    name: "KVN",
    thumb: "/images/kvn.png",
  },
  {
    id: "mooncake",
    name: "Mooncake",
    thumb: "/images/mooncake.png",
  },
  {
    id: "quinn",
    name: "Quinn Ergon",
    thumb: "/images/quinn.png",
  },
];

const DragTable = ({ data, header }) => {
  console.log(data);
  const [characters, updateCharacters] = useState(finalSpaceCharacters);
  const [isLoading, setIsLoading] = useState(true);
  const [getData, setGetData] = useState([data]);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setGetData(handleReOrder(items));
  }

  const handleReOrder = (data) => {
    const prevOrder = [...data];
    let newOrder = [];
    prevOrder.map((item, idx) => newOrder.push({ ...item, index: idx + 1 }));

    return newOrder;
  };

  return (
    <div className="flex items-center justify-start w-full h-full rounded-xl  gap-x-2 flex-wrap overflow-y-auto">
      <div className="flex w-full justify-center">
        <div className="flex w-full">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
              {(provided) => (
                <table
                  ref={provided.innerRef}
                  className="w-full text-sm text-left text-gray-500"
                >
                  <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                    <tr className="">
                      {header.map((item, idx) => (
                        <th
                          className="py-3 px-6 "
                          key={item.title}
                          id={item.title}
                          style={{ width: item.size }}
                        >
                          {item.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length &&
                      data.map((items, idx) => {
                        return (
                          <Draggable
                            key={items.pId}
                            draggableId={items.pId}
                            id={items.pId}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <tr
                                className={`border-b border-gray-700 ${
                                  snapshot.isDragging ? "bg-sky-600" : ""
                                }  `}
                                key={items + idx}
                                id={items.pId + "tr"}
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                              >
                                <td
                                  className="text-white text-sm font-semibold py-3 px-6"
                                  id={"order" + idx}
                                  key={"order" + idx}
                                >
                                  {idx + 1}
                                </td>
                                <td
                                  className="text-white text-sm font-semibold py-3 px-6"
                                  key={items.title + idx}
                                >
                                  {items.pName}
                                </td>
                                <td
                                  className="text-white text-sm font-semibold py-3 px-6"
                                  key={items.title + idx}
                                >
                                  {items.pEmail}
                                </td>
                                <td
                                  className="text-white text-sm font-semibold py-3 px-6"
                                  key={items.title + idx}
                                >
                                  {items.pTel}
                                </td>
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
      </div>
    </div>
  );
};

export default DragTable;
