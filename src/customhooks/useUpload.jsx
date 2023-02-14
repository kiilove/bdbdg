import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../firebase";

export const UploadMultiFiles = (e, type, folder, setResult) => {
  const downList = [];
  const promises = [];

  const newFileList = Array.prototype.slice.call(e.target.files);

  newFileList.map((item, idx) => {
    const filename = makeFileName(item.name, type);
    const storageRef = ref(storage, folder + filename);

    const uploadTask = uploadBytesResumable(storageRef, item);
    promises.push(uploadTask);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error(error.message);
      },
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setResult((prev) => [...prev, { link: downloadURL, filename }]);
        });
      }
    );
  });
  Promise.all(promises)
    .then(() => alert("All images uploaded"))
    .then((err) => console.log(err));

  console.log(downList);
};

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};
