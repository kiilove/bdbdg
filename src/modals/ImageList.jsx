import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { useEffect } from "react";

export const ImageList = ({ refType }) => {
  const [refFolder, setRefFolder] = useState();
  const [imageFiles, setImageFiles] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  console.log(refType);
  useEffect(() => {
    if (refType === "poster") {
      setRefFolder("images/poster");
    } else if (refType === "profile") {
      setRefFolder("images/profile");
    } else {
      setRefFolder("");
    }
    console.log(refFolder);
  }, [refType]);

  let URLs = [];
  useEffect(() => {
    console.log(refFolder);
    if (refFolder) {
      console.log(refFolder);
      const storage = getStorage();
      const listRef = ref(storage, refFolder);

      listAll(listRef)
        .then((res) =>
          res.items.forEach((itemRef) => {
            //files.push(itemRef.path);
            //setImageFiles(files);
            //console.log(itemRef.fullPath);
            //const storageRef = ref(storage, itemRef.fullPath);
            //console.log(storageRef);
            getDownloadURL(itemRef)
              .then((downloadURL) => {
                //console.log(downloadURL);
                URLs.push(downloadURL);
                //console.log(URLs.length);
                return URLs;
              })
              .then((urls) => setImageURLs([...urls]));
          })
        )
        .catch((error) => error.message);
    }
  }, [refFolder]);

  useEffect(() => {
    console.log(imageURLs);
  }, [imageURLs]);

  return (
    <div
      className="flex w-full h-full box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <div className="flex w-full justify-between flex-wrap gap-2 overflow-auto">
        {imageURLs &&
          imageURLs.map((item, idx) => (
            <div className="flex">
              <img
                src={item}
                onClick={() => {
                  console.log(item);
                }}
                className="flex w-20 h-20 hover:border-4 hover:border-gray-200 hover:cursor-pointer"
              />
            </div>
          ))}
      </div>
    </div>
  );
};
