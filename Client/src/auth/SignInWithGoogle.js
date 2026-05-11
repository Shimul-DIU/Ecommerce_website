import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {app} from '../firebase/firebase.config'
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async()=> {
  try {
    let result=await signInWithPopup(auth, provider);
    
    console.log('User info ',result.user)

     }

  catch(err){
    console.log(err)
  }
}
export default signInWithGoogle;