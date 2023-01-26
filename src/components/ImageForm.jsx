import {
  faEdit,
  faImages,
  faPlus,
  faThumbsUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useEffect } from "react";
import { UploadMultiFiles } from "../customhooks/useUpload";

const ImageForm = ({ prevImageList, prevSetImageList }) => {
  const [imageTitle, setImageTitle] = useState({});
  const [files, setFiles] = useState();
  const [newUpload, setNewUpload] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [imageView, setImageView] = useState({});
  console.log(prevImageList);

  const getImageTitle = (list) => {
    console.log(list);
    let getTitle;
    const findTitle = list.filter((item) => item.title === true);
    console.log(findTitle);
    if (findTitle.lenth) {
      console.log("??");
      getTitle = findTitle[0];
    } else {
      getTitle = list[0];
    }
    console.log(getTitle);
    return getTitle;
  };

  const resetImageTitle = (imageIndex, list) => {
    let dummy = [];

    const setTitle = () => {
      imageIndex &&
        list.map((item, idx) => {
          Number(imageIndex) === idx + 1
            ? dummy.push({ ...item, title: true })
            : dummy.push({ ...item, title: false });
        });
      return dummy;
    };

    return setImageList(setTitle());
  };

  const deleteImageList = (imageIndex) => {
    const delImage = () => {
      const newItem = imageList.filter(
        (item) => Number(item.id) !== imageIndex
      );
      getImageTitle(newItem);
      return newItem;
    };

    setImageList(delImage());
  };

  const uploadImage = async () => {
    const downlist = await UploadMultiFiles(files, "P", "images/poster/");
    return downlist;
  };

  const reduceImageList = (list) => {
    let dummy = [];

    if (!imageList.length) {
      list.map((item, idx) => {
        idx === 0
          ? dummy.push({ id: idx + 1, link: item, title: true })
          : dummy.push({ id: idx + 1, link: item, title: false });
      });
    } else {
      const prevCount = imageList.length;

      dummy = [...imageList];

      list.map((item, idx) => {
        console.log("OK");
        dummy.push({
          id: prevCount + idx + 1,
          link: item,
          title: false,
        });
      });
    }

    return dummy;
  };

  const handleUpload = async () => {
    await uploadImage(files, "P", "images/poster/")
      .then((list) => {
        console.log(list);
        reduceImageList(list);
      })
      .then((temp) => {
        console.log(temp);
      });
  };
  //const uploadFiles = useUploadMulti(files, "p", "images/poster/");
  useEffect(() => {
    console.log(typeof prevImageList);
    const listToArray = Array.prototype.slice.call(prevImageList);
    console.log(listToArray);
    setImageList(listToArray);
  }, []);

  useEffect(() => {
    imageList.length && setImageTitle(getImageTitle(imageList));
    //prevSetImageList(imageList);
    console.log("imageList", imageList);
  }, [imageList]);

  useEffect(() => {
    setImageView(imageTitle);
  }, [imageTitle]);

  useEffect(() => {
    files && handleUpload();
  }, [files]);

  useEffect(() => {
    newUpload.length && setImageList(reduceImageList(newUpload));
  }, [newUpload]);

  return (
    <div className="flex justify-center items-center w-full flex-col gap-y-4">
      {imageView ? (
        <div className="flex flex-col justify-center items-center w-full ">
          <div className="flex w-full h-full">
            {/* <img src={imageView.link} alt="" className="object-cover" /> */}
          </div>
          <div className="flex w-full h-full p-2">
            <div className="flex w-20 justify-center items-center">
              <button className="flex justify-center items-center w-8 h-8 bg-sky-500 rounded-xl hover:cursor-pointer">
                <FontAwesomeIcon
                  icon={faThumbsUp}
                  className="text-white text-lg"
                />
              </button>
            </div>
            <div className="flex w-20 justify-center items-center">
              <button className="flex justify-center items-center w-8 h-8 bg-sky-500 rounded-xl hover:cursor-pointer">
                <FontAwesomeIcon icon={faEdit} className="text-white text-lg" />
              </button>
            </div>
            <div className="flex w-20 justify-center items-center">
              <button
                className="flex justify-center items-center w-8 h-8 bg-sky-500 rounded-xl hover:cursor-pointer"
                onClick={() => {
                  deleteImageList(imageView.id);
                }}
              >
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="text-white text-lg"
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-32"></div>
      )}

      <div className="flex w-full h-full gap-2 justify-between items-center align-middle flex-wrap">
        {imageList ? (
          imageList.map((item, idx) => (
            <div
              className="flex w-16 h-full rounded-lg flex-col"
              style={{ backgroundColor: "rgba(7,11,41,1)" }}
            >
              <img
                src={item.link}
                className="flex w-16 h-16 p-1 border border-gray-300 object-cover hover:cursor-pointer"
                onClick={() => {
                  setImageView(item);
                }}
              />
            </div>
          ))
        ) : (
          <div></div>
        )}
        <div
          className="flex w-16 h-16 p-1 border border-gray-300 justify-center items-center "
          style={{ backgroundColor: "rgba(7,11,41,1)" }}
        >
          <label for="imageFiles">
            <div className="hover:cursor-pointer">
              <FontAwesomeIcon
                icon={faPlus}
                className="text-white font-extrabold text-2xl "
              />
            </div>
            <input
              type="file"
              id="imageFiles"
              name="imageFiles"
              className="hidden"
              multiple
              onChange={(e) => setFiles(e)}
            />
          </label>
        </div>
      </div>

      <div className="flex w-full">
        <button className="flex justify-center items-center w-full h-10 bg-sky-500 rounded-xl hover:cursor-pointer">
          <FontAwesomeIcon icon={faImages} className="text-white text-lg" />
          <span className="text-white font-light ml-3">기존 포스터 찾기</span>
        </button>
      </div>
    </div>
  );
};

export default ImageForm;
