import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

const auth = getAuth();

export const Login = (req) => {
  //const [loginRes, setLoginRes] = useState({});
  let res;
  signInWithEmailAndPassword(auth, req.email, req.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.email);
      return user.email;
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return (res = { status: "fail", errorCode, errorMessage });
    });
};
