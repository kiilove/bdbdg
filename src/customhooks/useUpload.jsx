import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../firebase";

export const UploadMultiple = (e, type, folder, resState) => {
  // 기존 파일을 불러와서 그 배열에 새로운 파일 푸시하는 형태로 코드 수정이 필요함
  // 지금 현재 코드는 새로 업로드한 파일 정보로 덮어씌우면서 기존 사진 파일 정보 날아감
  // 최초 컵등록시에 빈값으로 세팅하고
  // 빈값일때 기본 포스트 화면을 띄우도록 세팅하는게 나아보임
  // link가 없다면 덮어씌우고 link정보가 있다면 추가하는 형태로 작성해야할듯..
  // 만만치 않음
  // 23.0.25

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
