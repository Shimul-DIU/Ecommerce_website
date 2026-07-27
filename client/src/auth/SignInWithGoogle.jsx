import { signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import {auth} from '../firebase/firebase.config'

import axiosInstance from "../utils/axiosInstance";
let SignWithGoogle=async()=>{
  const navigate=useNavigate()
  const provider = new GoogleAuthProvider();
  try {
     const response=await signInWithPopup(auth, provider)
    let user=response.user;
    const res=await axiosInstance.post('/api/user/google-login',{
      fullname:user.displayName,
      email:user.email,
      img:user.photoURL,
      firebaseId: user.uid,
    })
    const token=res.data.token;
    {localStorage.setItem({googletoken:token})}
    const message=res.data.message;
    Navigate('/profile' )
  } catch (error) {
      console.log(error);
  }
}

export default SignWithGoogle;