import { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
  updateMetadata,
} from "firebase/storage";
import { compressImage } from "./imageUtils";

const useFirebaseStorage = (files, storagePath) => {
  const [progress, setProgress] = useState(0);
  const [urls, setUrls] = useState([]);
  const [errors, setErrors] = useState([]);
  const [representativeImage, setRepresentativeImage] = useState(null);

  useEffect(() => {
    const storage = getStorage();
    const originalRef = ref(storage, `${storagePath}/original`);
    const compressRef = ref(storage, `${storagePath}/compress`);

    const promises = Array.from(files).map((file, index) => {
      const metadataPromise = getMetadata(ref(storage, file.name)).catch(
        () => null
      );

      return Promise.all([metadataPromise]).then(async ([existingMetadata]) => {
        if (existingMetadata && existingMetadata.size === file.size) {
          setUrls((prevUrls) => [
            ...prevUrls,
            existingMetadata.customMetadata.url,
          ]);
          return null;
        }

        const maxSize = 1024 * 1024;
        const compressOptions = { maxWidthOrHeight: 1024, quality: 0.5 };
        const shouldCompress = file.size > maxSize;
        const compressedFile = shouldCompress
          ? await compressImage(file, compressOptions)
          : file;

        const newName = `bdbdg_${Date.now()}`;
        const uploadRef = shouldCompress
          ? ref(compressRef, newName)
          : ref(originalRef, newName);
        const uploadMetadata = {
          contentType: compressedFile.type,
          customMetadata: {
            url: "",
          },
        };
        const uploadTask = uploadBytesResumable(
          uploadRef,
          compressedFile,
          uploadMetadata
        );

        return new Promise((resolve) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgress(progress);
            },
            (error) => {
              setErrors((prevErrors) => [
                ...prevErrors,
                { name: file.name, error },
              ]);
              resolve(null);
            },
            () => {
              getDownloadURL(uploadRef).then((downloadURL) => {
                const originalUrl = shouldCompress
                  ? uploadMetadata.customMetadata.url
                  : downloadURL;
                const compressedUrl = shouldCompress
                  ? downloadURL
                  : originalUrl;
                setUrls((prevUrls) => [
                  ...prevUrls,
                  { originalUrl, compressedUrl },
                ]);
                updateMetadata(uploadRef, {
                  customMetadata: { url: downloadURL },
                });
                const image = { originalUrl, compressedUrl };
                if (index === 0) {
                  setRepresentativeImage(image);
                }
                resolve(image);
              });
            }
          );
        }).then((image) => {
          if (!image) {
            return null;
          }
          const { originalUrl, compressedUrl } = image;
          const finalUrl = compressedUrl || originalUrl;
          return {
            originalUrl,
            compressedUrl: compressedUrl ? finalUrl : null,
          };
        });
      });
    });

    Promise.all(promises).then((uploadedImages) => {
      setProgress(0);
      const uploadedUrls = uploadedImages
        .filter((image) => image !== null)
        .map((image) => ({
          originalUrl: image.originalUrl,
          compressedUrl: image.compressedUrl,
        }));
      setUrls(uploadedUrls);
    });
  }, [files, storagePath]);

  return { progress, urls, errors, representativeImage };
};

export default useFirebaseStorage;
