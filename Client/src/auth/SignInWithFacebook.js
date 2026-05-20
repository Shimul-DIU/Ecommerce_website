import {getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

let SignWithFacebook=async()=>{
  const provider = new FacebookAuthProvider();
  const auth = getAuth();
  try {
    const response = await signInWithPopup(auth, provider)
    let user=response.user;
    console.log(user);
    console.log(response);
    console.log(user.email);
  } catch(error) {
    console.log(error);
  }
}
export default SignWithFacebook;
