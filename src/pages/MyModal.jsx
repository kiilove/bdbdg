import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

export function MyModal({ isOpen, onClose, items }) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleOpenModal = () => {
    setScrollPosition(window.scrollY);
    // 모달 열기 로직
  };

  return (
    <>
      {/* 모달 버튼 */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={handleOpenModal}
      >
        Open Modal
      </button>

      {/* 모달 */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
          {/* 부모 요소 */}
          <div className="relative flex justify-center items-center h-screen">
            {/* 드래그 앤 드롭할 때 스크롤 위치 이동 */}
            <div
              className="absolute top-0 left-0 w-full h-full invisible"
              style={{ transform: `translateY(-${scrollPosition}px)` }}
            ></div>

            {/* 모달 */}
            <div
              className="bg-white rounded-md p-6 w-96 h-72 overflow-auto"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                X
              </button>
              <Droppable droppableId="items">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-gray-100 rounded-md px-4 py-2 mt-2 ${
                              snapshot.isDragging && "opacity-50"
                            }`}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
