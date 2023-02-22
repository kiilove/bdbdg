import {
  faEdit,
  faImages,
  faPlus,
  faThumbsUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useMemo, useState } from "react";
import { useEffect } from "react";
import { DeleteFile } from "../customhooks/DeleteFiles";
import { UploadMultiFiles } from "../customhooks/useUpload";

const PhotoUpload = ({
  prevImageList,
  prevSetImageList,
  header,
  uploadFolder,
}) => {
  const [imageTitle, setImageTitle] = useState({});
  const [files, setFiles] = useState();

  const [downlist, setDownlist] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [imageView, setImageView] = useState({});

  const getImageTitle = (list) => {
    let getTitle;
    const findTitle = list.filter((item) => item.title === true);

    if (findTitle === undefined || findTitle.length === 0) {
      getTitle = list[0];
    } else {
      getTitle = findTitle[0];
    }

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

    setImageList(setTitle());
  };

  const delImage = (id) => {
    return new Promise((resolve, reject) => {
      resolve(imageList.filter((item) => Number(item.id) !== id));
    });
  };
  const deleteImageList = (imageIndex, imageFilename) => {
    delImage(imageIndex)
      .then((result) => {
        setImageList(result);
        return result;
      })
      .then((result) => {
        const newTitle = getImageTitle(result);
        return newTitle;
      })
      .then((title) => setImageTitle(title))
      .then(() => DeleteFile("images/poster/", imageFilename));

    //setImageList(delImage());
  };

  const reduceImageList = (list) => {
    let dummy = [];

    if (!imageList.length) {
      list.map((item, idx) => {
        idx === 0
          ? dummy.push({
              id: idx + 1,
              link: item.link,
              title: true,
              filename: item.filename,
            })
          : dummy.push({
              id: idx + 1,
              link: item.link,
              title: false,
              filename: item.filename,
            });
      });
    } else {
      const prevCount = imageList.length;

      dummy = [...imageList];

      list.map((item, idx) => {
        dummy.push({
          id: prevCount + idx + 1,
          link: item.link,
          title: false,
          filename: item.filename,
        });
      });
    }

    return dummy;
  };
  // "images/poster/"
  const handleUpload = async (e, header, uploadFolder) => {
    await UploadMultiFiles(e, header, uploadFolder, setDownlist)
      .then(() => {
        reduceImageList(downlist);
      })
      .then((dummy) => {
        setImageList(dummy);
      })
      .then(() => {
        setFiles();
      });
  };

  useEffect(() => {
    //const listToArray = Array.prototype.slice.call(prevImageList);
    const firstView = prevImageList.filter((item) => item.title === true);
    console.log(firstView);
    setImageList(prevImageList);
    setImageView(firstView[0]);
  }, []);

  useMemo(() => {
    imageList.length && setImageTitle(getImageTitle(imageList));
    prevSetImageList(imageList);
  }, [imageList]);

  useEffect(() => {
    setImageView(imageTitle);
  }, [imageTitle]);

  useEffect(() => {
    downlist.length && setImageList(reduceImageList(downlist));
  }, [downlist]);

  useEffect(() => {
    console.log(imageView);
    console.log(imageTitle);
  }, [imageView]);

  return (
    <div className="flex justify-center items-center w-full flex-col gap-y-4">
      {imageView ? (
        <div className="flex flex-col justify-center items-center w-full ">
          <div className="flex w-full h-full">
            <img src={imageView.link} alt="" className="object-cover" />
          </div>
          <div className="flex w-full h-full p-2">
            <div className="flex w-20 justify-center items-center">
              <button
                className="flex justify-center items-center w-8 h-8 bg-sky-500 rounded-xl hover:cursor-pointer"
                onClick={() => resetImageTitle(imageView.id, imageList)}
              >
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
                  deleteImageList(imageView.id, imageView.filename);
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
              onChange={(e) => handleUpload(e, header, uploadFolder)}
            />
          </label>
        </div>
      </div>

      <div className="flex w-full">
        <button className="flex justify-center items-center w-full h-10 bg-sky-500 rounded-xl hover:cursor-pointer">
          <FontAwesomeIcon icon={faImages} className="text-white text-lg" />
          <span className="text-white font-light ml-3">사진찾기</span>
        </button>
      </div>
    </div>
  );
};

export default PhotoUpload;
