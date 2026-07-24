import {  getAuth, signInWithPopup,GoogleAuthProvider } from "firebase/auth";

let SignWithGoogle=async()=>{
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  try {
     const response=await signInWithPopup(auth, provider)
      let user=response.user;
      console.log(user.email);
  } catch (error) {
      console.log(error);
  }
}

export default SignWithGoogle;