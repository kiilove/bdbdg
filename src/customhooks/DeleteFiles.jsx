import { getStorage, ref, deleteObject } from "firebase/storage";

export const DeleteFile = (folder, filename) => {
  const storage = getStorage();

  const desertRef = ref(storage, folder + filename);

  deleteObject(desertRef)
    .then(() => {
      console.log("File deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting file", error.message);
      return;
    });
};
