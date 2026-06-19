import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../firebase/firebase.config";
const Forgotpassword = (email) => {
  const auth = getAuth(app);
  return sendPasswordResetEmail(auth, email);
};

export default Forgotpassword;