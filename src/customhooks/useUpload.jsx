import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../firebase";

export const UploadMultiple = (e, type, folder, resState) => {
  let upList = [];
  let downList = [];
  let promises = [];
  //let progress;
  //console.log(e.target.files.name);
  //const fileList = e.target.files.name;

  const fileList = Array.prototype.slice.call(e.target.files);
  //console.log(fileList);
  //console.log(fileList);
  //console.log(fileList[0].name);
  // fileList.map((item, idx) => {
  //   upList.push(makeFileName(item.name, type));
  // });

  fileList.map((item, idx) => {
    const storageRef = ref(
      storage,
      folder + "/" + makeFileName(item.name, type)
    );

    const uploadTask = uploadBytesResumable(storageRef, item);
    promises.push(uploadTask);

    try {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //console.log(downList);
            //downList.push(downloadURL);
            downList.push({
              id: idx + 1,
              link: downloadURL,
              title: idx == 0 ? true : false,
            });
            resState([...downList]);
          });
        }
      );
    } catch (error) {
      console.log(error.message);
    } finally {
      resState([...downList]);
      console.log("UPLOAD", downList);
    }
    //console.log(storageRef);

    //console.log(folder + makeFileName(item.name, type));
  });

  Promise.all(promises)
    .then(() => {
      console.log(upList);
      console.log(downList);
      console.log("업로드완료");
    })
    .catch((error) => {
      console.log(error.message);
    });

  return [upList, downList];
};

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};
