import CryptoJS from "crypto-js";
export const Encrypter = (keyValue) => {
  if (process.env.REACT_APP_SECRET_KEY && keyValue) {
    const encryptText = CryptoJS.AES.encrypt(
      keyValue,
      process.env.REACT_APP_SECRET_KEY
    ).toString();

    const checkEncrypted = Decrypter(encryptText);
    if (keyValue === checkEncrypted) {
      return encryptText;
    } else {
      return "encError";
    }
  }
};

export const Decrypter = (keyValue) => {
  if (process.env.REACT_APP_SECRET_KEY && keyValue) {
    const bytes = CryptoJS.AES.decrypt(
      keyValue,
      process.env.REACT_APP_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    return bytes;
  } else {
    return "내용표시실패";
  }
};
